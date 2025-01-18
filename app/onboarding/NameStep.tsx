import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomTextInput from '@/components/CustomTextInput';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/fonts';
import { RadioButton } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';


const NameStep = ({username}: {username: string}) => {
  const [text, setText] = useState(username);
  const [selectedValue, setSelectedValue] = useState('option1');
  const [selectedDate, setSelectedDate] = useState(''); 
  const router = useRouter();


  useEffect(() => {
    if (username) {
      setText(username);
    }
  }, [username]);

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <SafeAreaView style={styles.container}>
        <ProgressSteps progressBarColor={Colors.secondary[700]} 
        activeStepIconColor={Colors.secondary[700]}
        activeStepIconBorderColor={Colors.secondary[700]}
        activeStepNumColor={Colors.primary}
        completedStepIconColor={Colors.secondary[700]}
        completedProgressBarColor={Colors.secondary[700]}
        >
          {/* Progress Step 1 */}
          <ProgressStep nextBtnTextStyle={styles.nextBtnText} >
            <View style={styles.stepContent}>
              <Text style={styles.header}>What would you like us to call you?</Text>
              <Text style={styles.name}>Enter your Name</Text>
              <CustomTextInput
                value={text}
                placeholder='Name'
                handleChangeText={setText}
              />
            </View>
          </ProgressStep>
          {/* Progress Step 2 */}
          <ProgressStep nextBtnTextStyle={styles.nextBtnText} previousBtnTextStyle={styles.prevBtnText}>
            <View style={styles.stepContent}>
              <Text style={styles.header}>What is your age?</Text>
              <Text style={styles.name}>Enter your Age</Text>
              <CustomTextInput
                value={text}
                placeholder='Age'
                handleChangeText={setText}
              />
            </View>
          </ProgressStep>
          {/* Progress Step 3 */}
          <ProgressStep nextBtnTextStyle={styles.nextBtnText} previousBtnTextStyle={styles.prevBtnText}>
            <View style={styles.stepContent}>
              <Text style={styles.header}>What is your goal?</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioBtn}>
                  <RadioButton
                    value="option1"
                    status={selectedValue === 'option1' ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedValue('option1')}
                    color="#A7044F"
                  />
                  <Text style={styles.radioLabel}>Period Tracker</Text>
                </View>
                <View style={styles.radioBtn}>
                  <RadioButton
                    value="option2"
                    status={selectedValue === 'option2' ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedValue('option2')}
                    color="#A7044F"
                  />
                  <Text style={styles.radioLabel}>Pregnancy Tracker</Text>
                </View>
              </View>
            </View>
          </ProgressStep>
          {/* Progress Step 4 */}
          <ProgressStep nextBtnTextStyle={styles.nextBtnText} previousBtnTextStyle={styles.prevBtnText} onSubmit={() => router.push('./NotificationStep')}>
            <View>
              <Text style={styles.headerCalendar}>Your last menstrual date</Text>
            </View>
          <Calendar style={styles.calendar}
          cuurent={'2024-10.01'}
          onDayPress={day => {
            console.log('selected day', day);
            setSelectedDate(day.dateString)
          }}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: Colors.primary_pink800 }
          }}
          theme={{
            calendarBackground: Colors.secondary[500],
            backgroundColor: Colors.secondary[500],
            color: Colors.primary_text,
            monthTextColor: Colors.primary_text.brown,
            dayTextColor: Colors.primary_text.brown,
            arrowColor: Colors.primary_text.brown,
            todayTextColor: Colors.primary_text.brown,
            selectedDayTextColor: Colors.primary,
          }}
          />
          </ProgressStep>
        </ProgressSteps>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default NameStep;

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 10,
    width: 300,
    backgroundColor: Colors.secondary[500],
    paddingBottom: 30,
    marginLeft: 50,
  },
  header: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 50,
    textAlign: 'center',
    backgroundColor: Colors.secondary[700],
    color: Colors.primary,
    paddingTop: 15,
    fontFamily: Fonts.cbold,
    fontSize: 15,
  },
  name: {
    color: Colors.primary_text.brown,
    fontWeight: '600',
    fontSize: 15,
    paddingTop: 25,
    paddingLeft: 15,
  },
  nextBtnText: {
    color: Colors.primary_pink800,
    paddingBottom: 50,
  },
  prevBtnText: {
    color: Colors.primary_pink800,
    paddingBottom: 50,
  },
  radioGroup: {
    flexDirection: 'column',
    paddingLeft: 10,
    marginTop: 20,
  },
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    color: Colors.primary_text.brown,
    marginLeft: 8,
    fontWeight: 600,
  },
  progressbar:{
    color: Colors.primary_pink800,
  },
  calendar:{
    height: 380,
    width: 300,
    marginLeft: 50,
    borderRadius: 10,
    marginTop: 40,
    paddingTop: 10,
    backgroundColor: Colors.secondary[500],
    color: Colors.primary_text.brown,
  },
  headerCalendar:{
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 50,
    textAlign: 'center',
    backgroundColor: Colors.secondary[700],
    color: Colors.primary,
    paddingTop: 15,
    fontFamily: Fonts.cbold,
    width: 300,
    marginLeft: 50,
    fontSize: 15,
  },
});
