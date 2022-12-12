from calc_entropy import calc_entropy
from calc_total_entropy import calc_total_entropy

# DZIAŁA TYLKO NA POJEDYNCZE QID - ROZRÓŻNIAĆ STRINGI, LICZBY


def calc_info_gain(feature_name, train_data, label, class_list):
    feature_value_list = []
    for c in class_list:
        feature_value = train_data[c].get(feature_name, None)
        if feature_value is None:
            continue
        if isinstance(feature_value, str):
            if "|" in feature_value:
                splits = feature_value.split(" | ")
                for split in splits:
                    feature_value_list.append(split)
            else:
                feature_value_list.append(feature_value)
        # narazie ignorujemy typy inne niż string
        else:
            return -999999
    # print(feature_value_list)
    feature_value_list = list(set(feature_value_list))
    # print(feature_value_list) # unqiue values of the feature

    # częściowe dane - ignorujemy przypadki gdy kolumna dla wszystkich jest pusta
    if len(feature_value_list) == 0:
        return -999999
    total_row = len(train_data.keys())
    feature_info = 0.0

    for feature_value in feature_value_list:
        feature_value_data = {k: v for k, v in train_data.items() if isinstance(v.get(feature_name, None), str) and feature_value in v.get(feature_name, None)}  # filtering rows with that feature_value
        feature_value_count = len(feature_value_data.keys())
        # print(feature_value_data, feature_value)
        feature_value_entropy = calc_entropy(feature_value_data, label,
                                             class_list)  # calculcating entropy for the feature value
        feature_value_probability = feature_value_count / total_row
        feature_info += feature_value_probability * feature_value_entropy  # calculating information of the feature value

    return calc_total_entropy(train_data, label,
                              class_list) - feature_info  # calculating information gain by subtracting
