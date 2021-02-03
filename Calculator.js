import React, { useEffect, useState, useCallback } from 'react';
import { Text, TextInput, View, TouchableOpacity,
    Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import styles from "./styles";
import { useFonts, KulimPark_400Regular, KulimPark_700Bold } from "@expo-google-fonts/kulim-park";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Calculator() {
    const [currentNumberString, setCurrentNumberString] = useState("0");
    const [previousNumber, setPreviousNumber] = useState(null);
    const [previousDisplay, setPreviousDisplay] = useState("");
    const [currentOperator, setCurrentOperator] = useState(null);
    const [isOperatorActive, setOperatorStatus] = useState(false);
    const [currentNumberIsResult, setCurrentNumberAsResult] = useState(false);
    const [hasError, setErrorStatus] = useState(false);
    const [pastResults, setPastResults] = useState([]);
    const [moreButtonExpanded, setMoreButtonStatus] = useState(false);
    const [pasteFieldRequired, setPasteFieldRequired] = useState(false);
    const [pasteValue, setPastedValue] = useState('');
    // get past results from local storage
    useEffect(() => {
        const getData = async () => {
            try {
                let value = await AsyncStorage.getItem('@pastResults');
                value = value !== null ? JSON.parse(value) : [];
                setPastResults(value);
            } catch (e) {
                alert(`Could not retrieve past results`)
            }
        }
        getData().catch(e=>console.log(e));
    }, [])
    // used directly on previous expression/current number displayed on dom.
    // add thousand separators
    const formatForDisplay = useCallback( (str) => {
        // max digits for numbers displayed to user
        const maxDigits = {style:'decimal', maximumFractionDigits: 14, maximumSignificantDigits: 14};
        if (isNaN(Number(str))) return str;
        if (str === null) return str;
        // don't remove dot for decimal
        if (str.toString().slice(-1) === '.') {
            return `${Number(str.slice(0,-1)).toLocaleString()}.`
        }
        // don't remove zeros after a decimal
        if (str.toString().slice(-1) === "0" && str.toString().includes('.')) {
            console.log(str);
            const strArray = str.split('.');
            return `${strArray[0].toLocaleString()}.${strArray[1]}`
        }
        return Number(str).toLocaleString('en-US', maxDigits);
    }, [])
    // format current number for display - if current number is null, use previous number
    const formatCurrentNumberDisplayed = useCallback( (str) => {
        if (str === null) {return formatForDisplay(previousNumber)}
        return formatForDisplay(str);
    }, [formatForDisplay, previousNumber])
    // add new result to past results array. mutate where necessary
    const handlePastResults = useCallback( function (newResult) {
        let newArray = [...pastResults];
        if (pastResults.length >= 9) newArray.pop();
        newArray.unshift(newResult);
        setPastResults(newArray);
        AsyncStorage.setItem('@pastResults', JSON.stringify(newArray))
            .catch(e => alert(`Couldn't save result`));
    }, [pastResults])
    // clear past results
    const handleClearPastResults = () => {
        setPastResults([]);
        AsyncStorage.clear().catch(e => console.log(e));
        setTimeout(()=>setMoreButtonStatus(false), 200);
    }
    // function to handle selecting a past result - set it to current number string
    const handleUsePastResult = useCallback( function (pastResult, noLimit) {
        return () => {
            const resultToUse = pastResult.replace(/,/g, '');
            if (isNaN(Number(resultToUse))) {
                window.alert(pastResult + ' is not a valid number');
                return false
            }
            if (resultToUse.length > 14 && !noLimit) {
                window.alert(`Number is too big - 14 digits max (${resultToUse.length})`);
                return false
            }
            if (hasError) reset();
            else if (previousNumber) setPreviousDisplay(formatForDisplay(previousNumber));
            setCurrentNumberAsResult(false);
            if (isOperatorActive) {
                setOperatorStatus(false);
                if (currentOperator === '=') {
                    setPreviousDisplay("");
                    setPreviousNumber(null);
                    setCurrentOperator(null);
                }
            }
            setCurrentNumberString(resultToUse);
            setMoreButtonStatus(false);
            return true
        }
    }, [currentOperator, formatForDisplay, hasError, isOperatorActive, previousNumber])
    // function to handle pasted numbers
    const handlePastedNumber = useCallback(function (e) {
        e.preventDefault();
        if (pasteValue === "") return
        const pasteSuccess = handleUsePastResult(pasteValue)();
        if (pasteSuccess) {
            setPasteFieldRequired(false);
        }
    }, [handleUsePastResult, pasteValue])
    // function to prevent erroneous entries when focus is on a button
    const preventClickEventOnKeyDown = (e) => e.preventDefault();
    // function to handle number clicks
    const handleNumbers = useCallback(
        (number) => {
            return (e) => {
                if (hasError) return;
                // if operator isn't active, you're not adding to the current number string
                if (numberTooBig(currentNumberString) && !isOperatorActive) return;
                if (currentNumberString && currentNumberString.includes('.') && number === '.') return
                if (previousNumber) setPreviousDisplay(formatForDisplay(previousNumber));
                setCurrentNumberAsResult(false);
                if (isOperatorActive) {
                    setOperatorStatus(false);
                    setCurrentNumberString(number.toString());
                    if (currentOperator === '=') {
                        setPreviousDisplay("");
                        setPreviousNumber(null);
                        setCurrentOperator(null);
                    }
                } else if (number === '.') {
                    setCurrentNumberString(`${currentNumberString}${number}`);
                } else if (currentNumberString === "0" || !currentNumberString) {
                    setCurrentNumberString(number.toString());
                } else if (currentNumberString === "-0") {
                    setCurrentNumberString(`-${number.toString()}`);
                } else {
                    setCurrentNumberString(`${currentNumberString}${number}`);
                }
            }
        }, [currentNumberString, currentOperator, hasError, isOperatorActive, previousNumber, formatForDisplay]
    )
    // function to handle operator clicks
    const handleOperators = useCallback( (operator) => {
        return () => {
            if (hasError) return
            switch (currentNumberString) {
                case '-' :
                case '.' :
                case '-.' : {
                    return
                }
                default : break
            }
            setOperatorStatus(true);
            // handle arithmetic if there is a previous number
            let result;
            if (previousNumber !== null && currentNumberString !== null && currentOperator) {
                switch (currentOperator) {
                    case '+' : {
                        result = Number(previousNumber) + Number(currentNumberString);
                        break
                    }
                    case '-' : {
                        result = Number(previousNumber) - Number(currentNumberString);
                        break
                    }
                    case '*' : {
                        result = Number(previousNumber) * Number(currentNumberString);
                        break
                    }
                    case '/' : {
                        result = Number(previousNumber) / Number(currentNumberString);
                        break
                    }
                    case '^' : {
                        result = Number(previousNumber) ** Number(currentNumberString);
                        break
                    }
                    case '=' : {
                        result = Number(previousNumber);
                        break
                    }
                    default : {
                        result = Number(previousNumber);
                    }
                }
                // After clicking an operator that does arithmetic - show the last expression. If = just show the last number
                if (currentOperator === '=') {
                    setPreviousDisplay(formatForDisplay(previousNumber));
                } else {
                    setPreviousDisplay(
                        `${formatForDisplay(previousNumber)} ${currentOperator} ${formatForDisplay(currentNumberString)}`
                    );
                }
                // if number is too big or small, set error status
                if (!isFinite(result) || isNaN(result)) {
                    setErrorStatus(true);
                    setCurrentNumberString("ERROR, CLEAR");
                    return
                }
                if (result > 999999999999999 || result < -999999999999999) {
                    setErrorStatus(true);
                    setCurrentNumberString("TOO LONG, CLEAR");
                    return
                }
                if (`${result}`.includes('e')) {
                    result = result.toFixed(12);
                }
                // set current number to null. prevent further operations until another number is selected
                // set previous to result. Setting previous number here since user can't mutate result directly
                setCurrentNumberString(null);
                setCurrentNumberAsResult(true);
                handlePastResults(formatForDisplay(result));
                setPreviousNumber(formatForDisplay(result).replace(/,/g,''));
            }
            // if no calculation is done, set the current operator and the previous number as the current number displayed
            setCurrentOperator(operator);
            if (typeof result === 'undefined' && currentNumberString) {
                setPreviousNumber(Number(currentNumberString));
                setCurrentNumberString(null);
            }
        }
    }, [
        currentNumberString, currentOperator, formatForDisplay,
        hasError, previousNumber
    ]);
    // function to remove last user entry
    const removeLastEntry  = useCallback( function () {
        if (currentNumberIsResult || isOperatorActive || hasError) return;
        const currentLength = currentNumberString.length;
        if (currentLength <= 1) return setCurrentNumberString("0");
        setCurrentNumberString(currentNumberString.slice(0, currentLength-1));
    }, [currentNumberString, currentNumberIsResult, hasError, isOperatorActive])
    // function to handle negative toggle
    function handleNegativeToggle () {
        if (hasError) return
        // using the toggle right after an operation
        if (currentNumberIsResult || isOperatorActive) {
            setCurrentNumberAsResult(false);
            setPreviousDisplay("");
            if (currentOperator === '=') {
                setOperatorStatus(false);
                setCurrentOperator(null);
                setCurrentNumberString(`${-1 * previousNumber}`);
                setPreviousNumber(null);
                return
            } else {
                setPreviousNumber(previousNumber * -1);
                return
            }
        }
        if (currentNumberString[0] === '-') setCurrentNumberString(currentNumberString.slice(1));
        else setCurrentNumberString(`-${currentNumberString}`);
    }
    // function for Clear - Reset
    function reset () {
        setCurrentNumberString("0");
        setCurrentNumberAsResult(false);
        setPreviousNumber(null);
        setCurrentOperator(null);
        setPreviousDisplay(null);
        setErrorStatus(false);
    }
    // check if a current number has more than 12 significant digits
    function numberTooBig (str) {
        if (str === null) return false;
        const numberStr = str.toString();
        let length = str.length;
        if (numberStr.includes('.')) length--;
        if (numberStr.includes('-')) length--;
        return length >= 13;
    }
    // toggle past results container
    // status is optional - default is opposite of current status
    function toggleMoreOptions (newStatus) {
        if (newStatus && newStatus === 'collapse') return setMoreButtonStatus(false);
        setMoreButtonStatus(!moreButtonExpanded);
    }
    function togglePasteModal (newStatus) {
        if (newStatus && newStatus === 'collapse') return setPasteFieldRequired(false);
        setPasteFieldRequired(!pasteFieldRequired);
    }
    // all buttons in order (order is important)
    const buttons = [
        [
            ["Clr", "clear", 'clear', reset],
            ["⌫", 'backspace', "backspace", removeLastEntry],
            ["yˣ", 'powerOf', 'powerOf', handleOperators('^')],
            ["÷", 'operator', 'divide', handleOperators('/')]
        ],
        [
            ["7", 'regular', 'seven', handleNumbers(7)],
            ["8", 'regular', 'eight', handleNumbers(8)],
            ["9", 'regular', 'nine', handleNumbers(9)],
            ["×", 'operator', 'multiply', handleOperators('*')]
        ],
        [
            ["4", 'regular', 'four', handleNumbers(4)],
            ["5", 'regular', 'five', handleNumbers(5)],
            ["6", 'regular', 'six', handleNumbers(6)],
            ["-", 'operator', 'subtract', handleOperators('-')]
        ],
        [
            ["1", 'regular', 'one', handleNumbers(1)],
            ["2", 'regular', 'two', handleNumbers(2)],
            ["3", 'regular', 'three', handleNumbers(3)],
            ["+", 'operator', 'add', handleOperators('+')]
        ],
        [
            ["0", 'regular', 'zero', handleNumbers(0)],
            [".", 'regular', 'dot', handleNumbers('.')],
            ["±", 'regular', 'plusMinus', handleNegativeToggle],
            ["=", 'operator', 'equals', handleOperators('=')]
        ]
    ];
    return (
      <View style={styles.appContainer}>
          <View style={styles.displayContainer}>
              <View style={styles.operatorAndPreviousExpression}>
                  <KulimText style={styles.previousExpressionDisplay}>{previousDisplay}</KulimText>
                  <KulimText style={styles.currentOperatorDisplay}>{currentOperator}</KulimText>
              </View>
              <View style={styles.currentNumberDisplay}>
                   <KulimText style={styles.answer}>
                       {currentNumberIsResult ? "(Ans)" : ""}
                   </KulimText>
                  <KulimText
                      selectable={true}
                      fontWeight="bold"
                      numberOfLines={1}
                      adjustsFontSizeToFit={true}
                      style={hasError? [styles.currentNumber, styles.hasErrorText] : styles.currentNumber}
                  >
                      {formatCurrentNumberDisplayed(currentNumberString)}
                  </KulimText>
              </View>
              <View style={styles.moreButtonView}>
                  <TouchableOpacity
                      style={styles.moreButton}
                      onPress={toggleMoreOptions}
                      >
                      <KulimText style={styles.moreButtonText}>RESULTS</KulimText>
                  </TouchableOpacity>
                  <TouchableOpacity
                        style={[styles.moreButton, styles.pasteButton]}
                        onPress={togglePasteModal}
                      >
                      <KulimText style={styles.moreButtonText}>PASTE #</KulimText>
                  </TouchableOpacity>
                  <Modal
                      animationType="slide"
                      transparent={true}
                      visible={pasteFieldRequired}
                  >
                      <KeyboardAvoidingView style={[styles.moreContainerView, styles.moreInputView]}>
                          <TouchableOpacity
                              onPress={togglePasteModal}
                              style={styles.closeMoreButton}
                          >
                              <KulimText fontWeight="bold" style={styles.closeMoreButtonText}>×</KulimText>
                          </TouchableOpacity>
                          <KulimText fontWeight={'bold'} style={styles.pastResultsHeader}>PASTE OR ENTER A NUMBER</KulimText>
                          <View style={styles.pasteInputAndButtonWrapper}>
                              <TextInput
                              enablesReturnKeyAutomatically={true}
                              keyboardAppearance="dark"
                              keyboardType="numbers-and-punctuation"
                              returnKeyType="go"
                              style={styles.pasteField}
                              onSubmitEditing={handlePastedNumber}
                              onChangeText={(newValue) => setPastedValue(newValue)}
                          />
                              <TouchableOpacity
                                  onPress={handlePastedNumber}
                                  style={styles.applyButton}
                              >
                                  <KulimText fontWeight="bold" style={styles.applyButtonText}>✔</KulimText>
                              </TouchableOpacity></View>
                      </KeyboardAvoidingView>
                  </Modal>
                  <Modal
                      animationType="slide"
                      transparent={true}
                      visible={moreButtonExpanded}
                      >
                      <View style={styles.moreContainerView}>
                          <TouchableOpacity
                            onPress={toggleMoreOptions}
                            style={styles.closeMoreButton}
                          >
                              <KulimText fontWeight="bold" style={styles.closeMoreButtonText}>×</KulimText>
                          </TouchableOpacity>
                          <ScrollView style={styles.resultsContainer}>
                              {
                                  pastResults.length === 0 ?
                                      <KulimText fontWeight={'bold'} style={styles.pastResultsHeader}>NO RESULTS</KulimText> :
                                      <KulimText fontWeight={'bold'} style={styles.pastResultsHeader}>PAST RESULTS</KulimText>
                              }
                              {
                                  pastResults.map((result, index) => (
                                      <TouchableOpacity
                                          key={index}
                                          style={styles.pastResult}
                                          // onKeyDown={preventClickEventOnKeyDown}
                                          onPress={handleUsePastResult(result, true)}
                                      >
                                          <KulimText
                                              numberOfLines={1}
                                              adjustsFontSizeToFit={true}
                                              style={styles.pastResultText}
                                          >
                                              {result}
                                          </KulimText>
                                      </TouchableOpacity>
                                  ))
                              }
                              {
                                  pastResults.length > 0 &&
                                  <TouchableOpacity
                                      style={[styles.pastResult, styles.clearPastResults]}
                                      // onKeyDown={preventClickEventOnKeyDown}
                                      onPress={handleClearPastResults}
                                  >
                                     <KulimText style={styles.pastResultText}>Clear All Results</KulimText>
                                  </TouchableOpacity>
                              }
                          </ScrollView>
                      </View>
                  </Modal>
              </View>
          </View>
          <View style={styles.buttonContainer}>
          {
              buttons.map((buttonSection, index) => (
                  <View
                    key={index}
                    style={styles.buttonSection}
                  >
                      {
                          buttonSection.map(button => (
                              <TouchableOpacity
                                  key={button[2]}
                                  onKeyDown={preventClickEventOnKeyDown}
                                  onPress={button[3]}
                                  style={[styles.button, styles[button[1]]]}
                                  data-operator={button[2]}
                              >
                                  <KulimText
                                      numberOfLines={1}
                                      adjustsFontSizeToFit={true}
                                      style={styles.buttonText}
                                  >
                                      {(hasError && button[0] !=='Clr') ?"":button[0]}
                                  </KulimText>
                              </TouchableOpacity>
                          ))
                      }
                  </View>
              ))
          }
          </View>
      </View>
  );
}


function KulimText (props) {
    const [fontsLoaded] = useFonts({
        KulimPark_700Bold,
        KulimPark_400Regular
    })
    if (!fontsLoaded) {
        return null
    }
    const defaultStyle = { fontFamily: 'KulimPark_400Regular' }
    const boldStyle = {fontFamily: 'KulimPark_700Bold' }
    const style = props.fontWeight === 'bold' ? boldStyle : defaultStyle;
    const customStyles = Array.isArray(props.style) ? props.style : [props.style];
    return <Text {...props} style={[style, ...customStyles]}>{props.children}</Text>
}

export default Calculator;
