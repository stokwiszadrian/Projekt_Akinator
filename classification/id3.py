from make_tree import make_tree


def id3(train_data_m, label, class_list, feature_list):
    train_data = train_data_m.copy()
    tree = {}
    make_tree(tree, None, train_data, label, class_list, feature_list)
    return tree
