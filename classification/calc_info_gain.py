from calc_entropy import calc_entropy
from calc_total_entropy import calc_total_entropy

# DZIAŁA TYLKO NA POJEDYNCZE QID - ROZRÓŻNIAĆ STRINGI, LICZBY


def calc_info_gain(feature_name, train_data, label, class_list):
    feature_value_list = [None]
    feature_count = 0
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
            feature_count += 1
        # narazie ignorujemy typy inne niż string
        else:
            return -1
    feature_value_list = list(set(feature_value_list))
    if feature_name == "p27":
        print("VALUE LIST FOR P27", feature_value_list)
    # print(feature_value_list) # unqiue values of the feature

    # częściowe dane - ignorujemy przypadki gdy kolumna dla wszystkich jest pusta
    if len(feature_value_list) == 0:
        return -999999
    else:
        # print("FEATURE COUNT: ", feature_count, "\nFEATURE VALUE LIST LENGTH: ", len(feature_value_list))
        return feature_count / len(feature_value_list)

