import json

with open('data/services.json', 'r') as f:
    data = json.load(f)

def add_id(service_id, feature_idx, target_id):
    if service_id in data and 'features' in data[service_id]:
        if feature_idx < len(data[service_id]['features']):
            data[service_id]['features'][feature_idx]['id'] = target_id

# Map for custom-software
# 0 -> web-apps
# 1 -> saas
# 2 -> enterprise
add_id('custom-software', 0, 'web-apps')
add_id('custom-software', 1, 'saas')
add_id('custom-software', 2, 'enterprise')

# Map for mobile-apps
# 0 -> native
# 1 -> flutter
# 2 -> deployment
add_id('mobile-apps', 0, 'native')
add_id('mobile-apps', 1, 'flutter')
add_id('mobile-apps', 2, 'deployment')

# Map for ai-automation
# 0 -> chatbots
# 1 -> workflows
# 2 -> voice
add_id('ai-automation', 0, 'chatbots')
add_id('ai-automation', 1, 'workflows')
add_id('ai-automation', 2, 'voice')

# Map for cloud-devops
# 0 -> migration
# 1 -> cicd
add_id('cloud-devops', 0, 'migration')
add_id('cloud-devops', 1, 'cicd')

with open('data/services.json', 'w') as f:
    json.dump(data, f, indent=4)
