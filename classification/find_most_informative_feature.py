from calc_info_gain import calc_info_gain


def find_most_informative_feature(train_data, feature_list, label, class_list):
    # feature_list = train_data.columns.drop(label)  # finding the feature names in the dataset
    # N.B. label is not a feature, so dropping it
    max_info_gain = 0
    max_info_feature = None
    i = 0
    for feature in feature_list:  # for each feature in the dataset
        i += 1
        print(feature, f"{i} out of {len(feature_list)}")
        feature_info_gain = calc_info_gain(feature, train_data, label, class_list)

        if max_info_gain < feature_info_gain:  # selecting feature name with highest information gain
            max_info_gain = feature_info_gain
            max_info_feature = feature
        print(feature_info_gain)
    print("FROM INNER FUNC: ", max_info_feature)
    return max_info_feature
