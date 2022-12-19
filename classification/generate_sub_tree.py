def generate_sub_tree(feature_name, train_data, label, class_list):
    feature_value_count_dict = {}
    for c in class_list:
        feature_value = train_data[c].get(feature_name, None)
        if feature_value is None:
            continue
        if isinstance(feature_value, str):
            if "|" in feature_value:
                splits = feature_value.split(" | ")
                for split in splits:
                    if split not in feature_value_count_dict.keys():
                        feature_value_count_dict[split] = 1
                    else:
                        feature_value_count_dict[split] += 1
            else:
                if feature_value not in feature_value_count_dict.keys():
                    feature_value_count_dict[feature_value] = 1
                else:
                    feature_value_count_dict[feature_value] += 1

    print("feature_value_count_dict", feature_value_count_dict, "\n")
    tree = {}  # sub tree or node
    train_data_len_b4 = len(train_data.keys())
    for feature_value, count in feature_value_count_dict.items():
        feature_value_data = {k: v for k, v in train_data.items() if v.get(feature_name, None) is not None and feature_value in v.get(feature_name, None)}  # dataset with only feature_name = feature_value
        # print("feature value data:", feature_name, feature_value, count, feature_value_data, "\n")
        assigned_to_node = False  # flag for tracking feature_value is pure class or not
        for c in class_list:  # for each class
            class_count = 0
            if feature_value_data.get(c, None) is not None:
                class_count = 1 # count of class c
                # print("CLASS COUNT:", class_count)

            if class_count == count:  # count of (feature_value = count) of class (pure class)
                tree[feature_value] = c  # adding node to the tree
                train_data = {k: v for k, v in train_data.items() if v.get(feature_name, None) is None or (v.get(feature_name, None) is not None and feature_value not in v.get(feature_name, None))}  # removing rows with feature_value
                assigned_to_node = True
        if not assigned_to_node:  # not pure class
            tree[feature_value] = "?"  # as feature_value is not a pure class, it should be expanded further,
            # so the branch is marking with ?

    train_data_len_after = len(train_data.keys())
    # print("LENGTH BEFORE: ", train_data_len_b4, "\nLENGTH AFTER: ", train_data_len_after, "\n")
    return tree, train_data
