def leaf_nodes_total(d):
    sum = 0
    for k, v in d.items():
        if isinstance(v, dict):
            sum += leaf_nodes_total(v)
        else:
            sum += 1
    return sum


def leaf_nodes_per_key(d, prop=False):
    sums_dict = {}

    for k, v in d.items():
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


def best_prop_value(d, excluded_values=[]):
    root = next(iter(d))
    max = 0
    maxValue = None
    for k, v in d.get(root).items():
        if v > max and k not in excluded_values:
            max = v
            maxValue = k
    return root, maxValue

def get_subtree(d, instance):
    instancecp = instance.copy()
    for k, v in instance.items():
        try:
            subtree = d[k][v]
        except KeyError as err:
            return f"Key error: {k}"
        del instancecp[k]
        if len(instancecp.keys()) == 0:
            return subtree
        else:
            return get_subtree(subtree, instancecp)


if __name__ == "__main__":
    testdict = {
        "ab": {
            "cd": 12,
            "e": 412,
            "fs": {
                "asf": "1234",
                "gsa": {
                    "123": "ff"
                }
            },
            "sdfh": {
                "asd": 533,
                "1234": 346
            }
        }
    }
    grouped = leaf_nodes_per_key(testdict, True)
    print(grouped)
    print(best_prop_value(grouped, ["fs", "sdfh"]))
    instance = {
        "ab": "fs",
        "as": "xd"
    }
    subtree = get_subtree(testdict, instance)
    print(subtree)

