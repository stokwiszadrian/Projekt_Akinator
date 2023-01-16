from find_most_informative_feature import find_most_informative_feature
from generate_sub_tree import generate_sub_tree
import re

def make_tree(root, prev_feature_value, train_data, label, class_list, feature_list):
    # print("PREV ROOT", root)
    print("LENGTHS: ", len(train_data.keys()), len(feature_list))
    # print("LEN OF CLASS LIST", class_list)
    if len(train_data.keys()) != 0 and len(feature_list) != 0:  # if dataset becomes enpty after updating
        max_info_feature = find_most_informative_feature(train_data, feature_list, label, class_list)  # most informative feature
        if max_info_feature is None:
            print("---------------------------------RETURNED---------------------------------")
            return

        # print("MAX INFO FROM MAKE_TREE: ", max_info_feature)
        tree, new_train_data = generate_sub_tree(max_info_feature, train_data, label,
                                             class_list)  # getting tree node and updated dataset
        # print("MAX INFO AFTER SUB_TREE: ", max_info_feature)

        if prev_feature_value is not None:  # add to intermediate node of the tree
            root[prev_feature_value] = dict()
            root[prev_feature_value][max_info_feature] = tree
            next_root = root[prev_feature_value][max_info_feature]
        else:  # add to root of the tree
            root[max_info_feature] = tree
            next_root = root[max_info_feature]

        feature_list_cp = feature_list.copy()
        max_info_feature_cp = max_info_feature
        print("NEXT ROOT: ", next_root, "\n")
        try:
            feature_list_cp.remove(max_info_feature)
        except ValueError:
            print(max_info_feature, " already deleted")

        for node, branch in list(next_root.items()):  # iterating the tree node
            # print("NODE, BRANCH:", node, branch)
            if branch == "?":  # if it is expandable
                # print("EXPANDABLE")
                # prev
                #feature_value_data = {k: v for k, v in list(new_train_data.items()) if v.get(max_info_feature, None) is None or (isinstance(v.get(max_info_feature, None), str) and node in v.get(max_info_feature, None))}
                # new
                if node == "None":
                    feature_value_data = {k: v for k, v in list(new_train_data.items()) if v.get(max_info_feature, None) is None}
                else:
                    matchstring = f'^{node}$|\s{node}\s|^{node}\s'
                    feature_value_data = {k: v for k, v in list(new_train_data.items()) if isinstance(v.get(max_info_feature, None), str) and node in v.get(max_info_feature, None)}
                # if node == 'Q83286':
                #     print("-------------new train data items-------", new_train_data.items())
                #     print(feature_value_data)
                new_class_list = list(feature_value_data.keys())
                # print("FEATURE VALUE DATA: ", feature_value_data)# using the updated dataset
                make_tree(next_root, node, feature_value_data, label, new_class_list, feature_list_cp)  # recursive call with updated dataset
