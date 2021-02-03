import {StyleSheet, Platform} from "react-native";

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
    },
    displayContainer: {
        flex: 2,
        padding: 10,
    },
    moreButtonView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    pasteInputAndButtonWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    moreInputView: {
        flex: Platform.OS === 'android' ? 0.8 : 0.5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    pasteField: {
        marginBottom: 5,
        backgroundColor: 'white',
        width: '90%',
        height: 50,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 25,
        textAlign: 'center',
        color: 'dimgray'
    },
    applyButton: {
        height: 50,
        width: '90%',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: 'seagreen',
        alignItems: 'center',
        justifyContent: 'center'
    },
    applyButtonText: {
        fontSize: 40
    },
    pasteButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#008dc7'
    },
    moreButton: {
        width: 150,
        alignItems: 'center',
        borderRadius: 20,
        padding: 5,
        backgroundColor: '#70964C'
    },
    moreButtonText: {
        fontSize: 30,
    },
    moreContainerView: {
        flex: 1,
        marginVertical: 50,
        marginHorizontal: 30,
        borderRadius: 10,
        alignSelf: 'stretch',
        backgroundColor: 'cadetblue'
    },
    closeMoreButton: {
        width: 60,
        height: 60,
        margin: 5,
        borderRadius: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'firebrick'
    },
    closeMoreButtonText: {
        lineHeight: 70,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 70,
        color: 'antiquewhite'
    },
    resultsContainer: {
        padding: 10,
        flexShrink: 1
    },
    pastResultsHeader: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10
    },
    pastResultText: {
        fontSize: 35,
        textAlign: 'center',
        color: 'antiquewhite'
    },
    pastResult: {
        flexShrink: 1,
        margin: 5,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#708090'
    },
    clearPastResults: {
        flexShrink: 1,
        marginTop: 20,
        backgroundColor: '#b22222'
    },
    operatorAndPreviousExpression: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    previousExpressionDisplay: {
        flex: 9,
        fontSize: 25,
        color: 'antiquewhite'
    },
    currentOperatorDisplay: {
        flex: 1,
        fontSize: 25,
        color: 'antiquewhite',
        textAlign: 'right'
    },
    currentNumberDisplay: {
        flex: 3,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    answer: {
        color: 'lightgreen',
        fontSize: 30,
    },
    currentNumber: {
        fontSize: 48,
        color: 'antiquewhite'
    },
    hasErrorText: {
        color: 'red'
    },
    buttonContainer: {
        flex: 4,
        justifyContent: 'space-evenly',
        color: 'darkslategray',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: 80,
        borderRadius: 50,
        backgroundColor: '#708090',
        padding: 10,
        marginHorizontal: 10
    },
    operator: {
        backgroundColor: 'black',
    },
    clear: {
        backgroundColor: '#006400'
    },
    powerOf: {
        backgroundColor: '#e37b0e'
    },
    backspace: {
        backgroundColor: 'rgba(139,0,0,.6)'
    },
    regular: {
        color: 'black'
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    buttonText: {
        fontSize: 50,
        color: 'antiquewhite'
    }
});

export default styles;