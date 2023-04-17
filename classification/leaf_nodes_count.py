def leaf_nodes_total(tree):
    """Returns the number of leaf nodes present in given tree"""
    sum = 0
    for k, v in tree.items():
        if isinstance(v, dict):
            sum += leaf_nodes_total(v)
        else:
            sum += 1
    return sum


def leaf_nodes_per_key(tree, prop=False):
    """Sums the number of leaf nodes for every key in a given tree.

    :param tree: Dict containing a tree structure
    :param prop: Set to True if the root of a given tree is a property and is not the value of a certain property.
    :return: A dict containing key-value pairs representing the number of leaf nodes for a given key.
    """
    sums_dict = {}

    for k, v in tree.items():
        if prop:
            if isinstance(v, dict):
                sums_dict[k] = leaf_nodes_per_key(v, False)
            else:
                sums_dict[k] = 1
        else:
            if isinstance(v, dict):
                sums_dict[k] = leaf_nodes_total(v)
            else:
                sums_dict[k] = 1
    return sums_dict


# ------ Zwraca korzeń i jego najlepszą wartość
def best_prop_value(data, excluded_values=[]):
    """Calculates the next best root and value to use.

    :param data: A dictionary containing tree keys and the number of corresponding leaf nodes.
    :param excluded_values: Optional. A list of values containing keys to skip.
    :return: root: Value of best calculated property, maxValue: Next best value for given data.
    """
    root = next(iter(data))
    max = 0
    maxValue = None
    for k, v in data.get(root).items():
        if v > max and k not in excluded_values:
            max = v
            maxValue = k
    return root, maxValue


# ------ Generuje poddrzewo z listy klucz-wartosc otrzymywanej od użytkownika
def get_subtree(tree, instance):
    """Generates a subtree given the current depth travelled to by the end user.

    :param tree: A tree-like dict used by the server.
    :param instance: A dict of property-value pairs used to "travel up" the tree.
    :return: A dict containing the subtree.
    """
    instancecp = instance.copy()
    for k, v in instance.items():
        try:
            subtree = tree[k][v]
        except KeyError as err:
            return f"Key error: {k}"
        del instancecp[k]
        if len(instancecp.keys()) == 0:
            return subtree
        else:
            return get_subtree(subtree, instancecp)
