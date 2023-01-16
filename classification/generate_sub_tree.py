import re
def generate_sub_tree(feature_name, train_data, label, class_list):
    feature_value_count_dict = {}
    for c in class_list:
        feature_value = train_data[c].get(feature_name, None)
        if feature_value is None:
            if "None" not in feature_value_count_dict.keys():
                feature_value_count_dict["None"] = 1
            else:
                feature_value_count_dict["None"] += 1
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

    # print("feature_value_count_dict", feature_value_count_dict)
    tree = {}  # sub tree or node
    train_data_cp = train_data.copy()
    train_data_len_b4 = len(train_data.keys())
    for feature_value, count in feature_value_count_dict.items():
        if feature_value == 'None':
            feature_value_data = {k: v for k, v in train_data.items() if
                                  v.get(feature_name, None) is None}  # dataset with only feature_name = feature_value
        else:
            feature_value_data = {k: v for k, v in train_data.items() if v.get(feature_name, None) is not None and feature_value in v.get(feature_name, None)}  # dataset with only feature_name = feature_value
        # if feature_value == 'Q83286':
        #     print("\n", "feature value data:", feature_name, feature_value, count, feature_value_data, "\n")
        # else:
        #     print("\n", "feature value data:", feature_name, feature_value, count, "\n")
        assigned_to_node = False  # flag for tracking feature_value is pure class or not
        for c in class_list:  # for each class
            class_count = 0
            if (feature_name == "None" and feature_value_data.get(c, None) is None) or (feature_name != "None" and feature_value_data.get(c, None) is not None):
                class_count = 1 # count of class c

            if class_count == count:  # count of (feature_value = count) of class (pure class)
                tree[feature_value] = c  # adding node to the tree
                matchstring = f'^{feature_value}$|\s{feature_value}\s|^{feature_value}\s'
                # previous
                train_data_cp = {k: v for k, v in train_data_cp.items() if v.get(feature_name, None) is None or (v.get(feature_name, None) is not None and re.search(matchstring, v.get(feature_name, None)) is None)}  # removing rows with feature_value
                # now
                # train_data_cp = {k: v for k, v in train_data_cp.items() if v.get(feature_name, None) is not None and feature_value not in v.get(feature_name, None)}  # removing rows with feature_value

                assigned_to_node = True
        if not assigned_to_node:  # not pure class
            tree[feature_value] = "?"  # as feature_value is not a pure class, it should be expanded further,
            # so the branch is marked with ?
        # print("CP KEYS LEN", len(train_data_cp.keys()))
        # if 'Q360' in train_data_cp.keys():
        #     print("Q360 IN", len(train_data_cp.keys()))

    # train_data_len_after = len(train_data.keys())
    # print("LENGTH BEFORE: ", train_data_len_b4, "\nLENGTH AFTER: ", train_data_len_after, "\n")
    return tree, train_data_cp
