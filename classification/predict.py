def predict(tree, instance):
    if not isinstance(tree, dict): #if it is leaf node
        return tree #return the value
    else:
        root_node = next(iter(tree)) #getting first key/feature name of the dictionary
        feature_value = instance.get(root_node, None) #value of the feature
        # print("ROOT NODE, FEATURE VALUE:", root_node, feature_value)
        # print(tree[root_node])
        if feature_value is not None and feature_value in tree[root_node]: #checking the feature value in current tree node
            return predict(tree[root_node][feature_value], instance) #goto next feature
        else:
            return None