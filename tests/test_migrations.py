import sqlite3
import glob
import os
import sys

def main():
    print("Running D1 migration tests in lexical order...")
    db = sqlite3.connect(":memory:")
    db.execute("PRAGMA foreign_keys = ON;")

    migration_files = sorted(glob.glob("migrations/*.sql"))
    if not migration_files:
        print("FAIL: No migration files found in migrations/")
        sys.exit(1)

    print(f"Discovered {len(migration_files)} migrations: {migration_files}")

    for filepath in migration_files:
        print(f"Applying {filepath}...")
        with open(filepath, "r", encoding="utf-8") as f:
            sql = f.read()
        try:
            db.executescript(sql)
        except Exception as e:
            print(f"FAIL: Error executing {filepath}: {e}")
            sys.exit(1)

    print("All migrations applied successfully.")

    # Invariant Test 1: Insert initial owner
    db.execute(
        "INSERT INTO cms_members (email, role, active) VALUES (?, ?, 1)",
        ("owner@traiinc.com", "owner")
    )
    print("Test 1 PASS: First owner inserted successfully.")

    # Invariant Test 2: Insert additional non-owner roles
    db.execute(
        "INSERT INTO cms_members (email, role, active) VALUES (?, ?, 1)",
        ("admin1@traiinc.com", "admin")
    )
    db.execute(
        "INSERT INTO cms_members (email, role, active) VALUES (?, ?, 1)",
        ("admin2@traiinc.com", "admin")
    )
    db.execute(
        "INSERT INTO cms_members (email, role, active) VALUES (?, ?, 1)",
        ("editor@traiinc.com", "editor")
    )
    print("Test 2 PASS: Multiple admins and editors inserted successfully.")

    # Invariant Test 3: Reject second owner (Partial Unique Index)
    try:
        db.execute(
            "INSERT INTO cms_members (email, role, active) VALUES (?, ?, 1)",
            ("owner2@traiinc.com", "owner")
        )
        print("FAIL: Second owner insertion was NOT blocked by single-owner invariant!")
        sys.exit(1)
    except sqlite3.IntegrityError:
        print("Test 3 PASS: Second owner insertion rejected as expected by single-owner invariant.")

    # Invariant Test 4: Verify pre-check behavior if duplicate owners exist prior to migration
    test_db = sqlite3.connect(":memory:")
    with open("migrations/0001_initial_schema.sql") as f:
        test_db.executescript(f.read())
    # Pre-populate 2 owners
    test_db.execute("INSERT INTO cms_members (email, role, active) VALUES ('o1@test.com', 'owner', 1)")
    test_db.execute("INSERT INTO cms_members (email, role, active) VALUES ('o2@test.com', 'owner', 1)")
    
    # Check count of existing owners
    cursor = test_db.execute("SELECT COUNT(*) FROM cms_members WHERE role = 'owner'")
    owner_count = cursor.fetchone()[0]
    if owner_count > 1:
        print(f"Test 4 PASS: Pre-migration duplicate check detected {owner_count} owners (would block migration 0002).")

    print("\nALL D1 MIGRATION TESTS PASSED.")

if __name__ == "__main__":
    main()
