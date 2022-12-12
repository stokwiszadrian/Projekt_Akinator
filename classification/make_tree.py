from find_most_informative_feature import find_most_informative_feature
from generate_sub_tree import generate_sub_tree


def make_tree(root, prev_feature_value, train_data, label, class_list, feature_list):
    if len(train_data.keys()) != 0:  # if dataset becomes enpty after updating
        max_info_feature = find_most_informative_feature(train_data, feature_list, label, class_list)  # most informative feature
        tree, train_data = generate_sub_tree(max_info_feature, train_data, label,
                                             class_list)  # getting tree node and updated dataset
        next_root = None

        if prev_feature_value is not None:  # add to intermediate node of the tree
            root[prev_feature_value] = dict()
            root[prev_feature_value][max_info_feature] = tree
            next_root = root[prev_feature_value][max_info_feature]
        else:  # add to root of the tree
            root[max_info_feature] = tree
            next_root = root[max_info_feature]

        for node, branch in list(next_root.items()):  # iterating the tree node
            if branch == "?":  # if it is expandable
                feature_value_data = train_data[train_data[max_info_feature] == node]  # using the updated dataset
                make_tree(next_root, node, feature_value_data, label, class_list)  # recursive call with updated dataset
