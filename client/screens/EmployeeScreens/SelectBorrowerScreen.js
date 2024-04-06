import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image, FlatList, SafeAreaView } from "react-native";
import { globalStyles } from "../../styles/global";
import axios from "axios";
import EmployeeItem from "../../components/EmployeeItem";
import FlatButton from "../../shared/FlatButton";
import { useIsFocused } from "@react-navigation/native";
import ReaderItem from "../../components/ReaderItem";
import SearchBar from "../../components/SearchBar";
import { SCREEN_WIDTH, _retrieveData, normalize } from "../../defined_function";
import { ScrollView } from "react-native-gesture-handler";

function SelectBorrowerScreen({ navigation }) {
  const [readers, setReaders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const isFocused = useIsFocused();
  useEffect(() => {
    setSearchValue("");

    if (isFocused) {
      _retrieveData("ACCESS_TOKEN")
        .then((access_token) => {
          const config = {
            headers: { Authorization: `Bearer ${access_token}` },
          };
          axios
            .get(`http://10.0.2.2:5000/borrowed-books/borrowers`, config)
            .then((result) => {
              setReaders([...result.data]);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFocused]);

  const onSearch = () => {
    navigation.navigate("Search Results", {
      search_value: searchValue,
      placeholder: "search readers...",
      type: "readers",
    });
  };

  return (
    <View style={styles.wrapper}>
      <SearchBar
        _styles={styles.searchBar}
        placeholder="search readers..."
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        onSearch={onSearch}
      />

      <ScrollView>
        <View style={styles.readerList}>
          {readers.map((reader, index) => {
            return (
              <ReaderItem
                key={index}
                _style={[styles.readerItem]}
                borrowed_books={1}
                data={reader}
                onPress={() =>
                  navigation.navigate("Select Book Group", {
                    reader_info: reader,
                  })
                }
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  readerList: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(6),
    overflow: "scroll",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  readerItem: {
    width: "40%",
    padding: normalize(10),
    margin: 10,
    borderRadius: normalize(10),
  },
});

export default SelectBorrowerScreen;
