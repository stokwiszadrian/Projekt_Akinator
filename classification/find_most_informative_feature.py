from calc_info_gain import calc_info_gain


def find_most_informative_feature(train_data, feature_list, label, class_list):
    max_info_gain = 0
    max_info_feature = None
    i = 0

    # ------ Obliczanie wartości informacyjnej dla każdego atrybutu
    for feature in feature_list:
        i += 1
        feature_info_gain = calc_info_gain(feature, train_data, class_list)

        if max_info_gain < feature_info_gain:
            max_info_gain = feature_info_gain
            max_info_feature = feature
    return max_info_feature
