import re


def generate_sub_tree(feature_name, train_data, label, class_list):
    feature_value_count_dict = {}
    # ------ Zliczanie ilości wystąpień danej wartości wybranego atrybutu
    for c in class_list:
        try:
            feature_value = train_data[c][feature_name]
            # if isinstance(feature_value, str):
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
        except KeyError as k:
            if "None" not in feature_value_count_dict.keys():
                feature_value_count_dict["None"] = 1
            else:
                feature_value_count_dict["None"] += 1
        # feature_value = train_data[c].get(feature_name, None)
        # if feature_value is None:
        #     if "None" not in feature_value_count_dict.keys():
        #         feature_value_count_dict["None"] = 1
        #     else:
        #         feature_value_count_dict["None"] += 1
        # if isinstance(feature_value, str):
        #     if "|" in feature_value:
        #         splits = feature_value.split(" | ")
        #         for split in splits:
        #             if split not in feature_value_count_dict.keys():
        #                 feature_value_count_dict[split] = 1
        #             else:
        #                 feature_value_count_dict[split] += 1
        #     else:
        #         if feature_value not in feature_value_count_dict.keys():
        #             feature_value_count_dict[feature_value] = 1
        #         else:
        #             feature_value_count_dict[feature_value] += 1
    # ------ Generowanie poddrzewa
    tree = {}
    train_data_cp = train_data.copy()
    train_data_len_b4 = len(train_data.keys())

    # ------ Pętla dla każdej pary wartość - ilość wystąpień
    for feature_value, count in feature_value_count_dict.items():
        if feature_value == 'None':
            # ------ filtrowanie encji, dla których dany atrybut jest pusty
            feature_value_data = {k: v for k, v in train_data.items() if
                                  v.get(feature_name, None) is None}
        else:
            # ------ filtrowanie encji, dla których dany atrybut nie jest pusty
            feature_value_data = {k: v for k, v in train_data.items() if v.get(feature_name, None) is not None and feature_value in v.get(feature_name, None)}  # dataset with only feature_name = feature_value

        # ------ flaga do śledzenia, czy feature_value jest liściem
        assigned_to_node = False
        for c in class_list:
            class_count = 0
            if (feature_name == "None" and feature_value_data.get(c, None) is None) or (feature_name != "None" and feature_value_data.get(c, None) is not None):
                class_count = 1

            # ------ jeśli true, to dany node jest liściem
            if class_count == count:
                tree[feature_value] = c
                matchstring = f'^{re.escape(feature_value)}$|\s{re.escape(feature_value)}\s|^{re.escape(feature_value)}\s'
                matchstring_old = f'^{feature_value}$|\s{feature_value}\s|^{feature_value}\s'
                # ------ filtrowanie encji, dla których dany atrybut ma inna wartość niż wartość w liściu
                train_data_cp = {k: v for k, v in train_data_cp.items() if v.get(feature_name, None) is None or (v.get(feature_name, None) is not None and re.search(matchstring, v.get(feature_name, None)) is None)}  # removing rows with feature_value

                assigned_to_node = True

        if not assigned_to_node:
            # ------ oznaczenie tego miejsca w drzewie jako miejsca do potencjalnej eksapnsji
            tree[feature_value] = "?"

    train_data_len_after = len(train_data_cp.keys())
    # print("LENGTH BEFORE: ", train_data_len_b4, "\nLENGTH AFTER: ", train_data_len_after, "\n")
    # ------ zwracanie drzewa i nowej listy encji
    return tree, train_data_cp
