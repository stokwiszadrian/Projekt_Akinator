from make_tree import make_tree


def id3(train_data_m, label, class_list, feature_list):
    train_data = train_data_m.copy() #getting a copy of the dataset
    tree = {} #tree which will be updated
    make_tree(tree, None, train_data, label, class_list, feature_list) #start calling recursion
    return tree