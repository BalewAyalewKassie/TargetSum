import React from 'react';
import {View, Text,Button, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';
class Game extends React.Component {
  static propTypes={
    randomNumberCount:PropTypes.number.isRequired,
    initialSeconds:PropTypes.number.isRequired,
    onPlayAgain:PropTypes.func.isRequired,
  };
state={
  selectedIds:[],
  remainingSeconds:this.props.initialSeconds,
};
gameStatus='PLAYING';
  randomNumbers=Array
  .from({length:this.props.randomNumberCount})
  .map(()=>1+Math.floor(10*Math.random()));

    target=this.randomNumbers
    .slice(0,this.props.randomNumberCount-2)
    .reduce((acc,curr)=>acc+curr,0);
     shuffledRandomNumbers=shuffle(this.randomNumbers);

    componentDidMount(){
    this.intervalId=  setInterval(()=>{
        this.setState((prevState)=>{
          return{remainingSeconds:prevState.remainingSeconds-1};
        },()=>{
          if(this.state.remainingSeconds===0){
            clearInterval(this.intervalId);
          }
        });
      },1500);
    };
    componentWillUnmount(){
      clearInterval(this.intervalId);
    };
    UNSAFE_componentWillUpdate(nextProps,nextState){
      if(nextState.selectedIds!==this.state.selectedIds||
      nextState.remainingSeconds===0){
        this.gameStatus=this.calcGameStatus(nextState);
        if(this.gameStatus!=='PLAYING'){
          clearInterval(this.intervalId);
        }
      }


    };
isNumberSelected=(numberIndex)=>{
  return this.state.selectedIds.indexOf(numberIndex)>=0;

};
selectNumber=(numberIndex)=>{
  this.setState((prevState)=>({
    selectedIds:[...prevState.selectedIds,numberIndex],
  }));
  };
  calcGameStatus=(nextState)=>{
    const sumSelected=nextState.selectedIds.reduce((acc,curr)=>{
      return acc+this.shuffledRandomNumbers[curr];

    },0);
    if(nextState.remainingSeconds===0){
      return 'LOST'
    }
    if(sumSelected<this.target){
      return 'PLAYING';
    }
    if(sumSelected===this.target){
      return 'WON'
    }
    if(sumSelected>this.target){
      return 'LOST'
    }
};
  render() {
    const gameStatus=this.gameStatus;
    return(
      <View style={styles.container}>
        <Text style={styles.remaining_Seconds}>{['Remaining Seconds: ',this.state.remainingSeconds]}</Text>
      <Text style={[styles.target,styles['STATUS_'+gameStatus]]}>{this.target}</Text>
      <View style={styles.randomContainer}>
    {this.shuffledRandomNumbers.map((randomNumber,index)=>
      <RandomNumber
      key={index}
      id={index}
      number={randomNumber}
      isDisabled={
        this.isNumberSelected(index)|| gameStatus!=='PLAYING'}
      onPress={
        this.selectNumber}
      />
    )}
    </View>
    <Text style={styles.remaining_Seconds}>{['Game Status: ',gameStatus]}</Text>
    {this.gameStatus!=='PLAYING'&&(
      <Button title="Play Again" onPress={this.props.onPlayAgain}/>
  )}
      </View>
    );
  }
}
const styles=StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    flex:1,
    paddingTop:10,
      borderWidth: 5,
      borderColor:'beige',
  },
  target:{
    fontSize:40,
    marginHorizontal:50,
    margin:30,
    textAlign:'center',
    borderWidth: 3,
  },
  randomContainer:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-around',
  },
STATUS_PLAYING:{
    backgroundColor: '#bbb',
},
STATUS_WON:{
    backgroundColor: 'green',
},
STATUS_LOST:{
    backgroundColor: 'red',
},
remaining_Seconds:{
  fontSize:25,
  textAlign:'center',
  marginTop: 10,
  },
});
export default Game;
