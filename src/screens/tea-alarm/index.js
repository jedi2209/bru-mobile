import React, {useRef} from 'react';
import {Button, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CircularProgress from 'react-native-circular-progress-indicator';
import Wrapper from '@comp/Wrapper';

import {colors} from '@styleConst';

const TeaAlarmScreen = props => {
  const progressRef = useRef(null);
  return (
    <Wrapper {...props}>
      <CircularProgress
        title={'%'}
        value={97}
        radius={120}
        ref={progressRef}
        inActiveStrokeOpacity={0.5}
        activeStrokeWidth={20}
        inActiveStrokeWidth={20}
        progressValueStyle={{fontWeight: '100', color: 'white'}}
        activeStrokeSecondaryColor="yellow"
        inActiveStrokeColor="white"
        duration={30000}
        dashedStrokeConfig={{
          count: 50,
          width: 4,
        }}
        progressFormatter={value => {
          'worklet';
          if (value <= 30) {
            return 0;
          }
          if (value > 30 && value <= 60) {
            return 30;
          }
          if (value > 60 && value <= 90) {
            return 60;
          }
          if (value > 90) {
            return 90;
          }
        }}
        onAnimationComplete={() => {}}
      />
      <Button
        size={30}
        onPress={() => progressRef.current.reAnimate()}
        title="Reanimate"
        color={colors.black}
      />
      <Button
        size={30}
        onPress={() => progressRef.current.pause()}
        title="Pause"
        color={colors.white}
      />
      <Button
        size={30}
        onPress={() => progressRef.current.play()}
        title="Play"
        color={colors.black}
      />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
      <Text>Home Screen</Text>
      <Icon name="rocket" size={30} color={colors.black} />
    </Wrapper>
  );
};

export default TeaAlarmScreen;
