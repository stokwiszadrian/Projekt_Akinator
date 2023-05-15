from find_most_informative_feature import find_most_informative_feature
from generate_sub_tree import generate_sub_tree


def make_tree(root, prev_feature_value, train_data, class_list, feature_list):
    """Recursively creates a decision tree from a given dataset.

    :param root: A dict from which the tree will be generated.
    :param prev_feature_value: A feature value used in previous iteration. This should be *None* for
            the top function call.
    :param train_data: A dataset containing classes and their feature values.
    :param class_list: A list of
    :param feature_list: A list of available attributes.
    :return: A dict containing the decision tree.
    """
    if len(train_data.keys()) != 0 and len(feature_list) != 0:
        max_info_feature = find_most_informative_feature(train_data, feature_list, class_list)
        # ------ Jeśli nie ma atrybutów do wybrania, kończymy działanie funkcji
        if max_info_feature is None:
            return

        tree, new_train_data = generate_sub_tree(max_info_feature, train_data,
                                             class_list)

        # ------ dołączenie do poprzedniej wartości w drzewie
        if prev_feature_value is not None:
            root[prev_feature_value] = dict()
            root[prev_feature_value][max_info_feature] = tree
            next_root = root[prev_feature_value][max_info_feature]
        else:  
            # ------ dołączenie do korzenia drzewa
            root[max_info_feature] = tree
            next_root = root[max_info_feature]

        feature_list_cp = feature_list.copy()
        try:
            feature_list_cp.remove(max_info_feature)
        except ValueError:
            # "Obsługa" wyjątku
            ignore = 'this'

        for node, branch in list(next_root.items()):  # iterating the tree node
            if branch == "?":  # if it is expandable
                # ------ dodawanie poddrzewa
                if node == "None":
                    feature_value_data = {k: v for k, v in list(new_train_data.items()) if v.get(max_info_feature, None) is None}
                else:
                    feature_value_data = {k: v for k, v in list(new_train_data.items()) if isinstance(v.get(max_info_feature, None), str) and node in v[max_info_feature]}
                new_class_list = list(feature_value_data.keys())
                # ------ rekursywne odwołanie z zbiorem danych
                make_tree(next_root, node, feature_value_data, new_class_list, feature_list_cp)
