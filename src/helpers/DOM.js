
/**
* A function that receives the current window and state.innerHeight and calculates the dialogWidth and dialogHeight.
* It accounts for the height of the Header and Input elements as well as their margins. 
*/
export const handleResize = (window, innerHeight) => {
  const header = document.querySelector('.container header');
  const input = document.querySelector('.container .text-form') 
              || document.querySelector('.container .single-button') 
              || document.querySelector('.container .double-button');
  // the last calculation is the 10px margin for the header and the input as well as the 2px border on very top and bottom
  let dialogWidth = header.offsetWidth;
  let dialogHeight = innerHeight - header.offsetHeight - input.offsetHeight - 4*10 - 2*2; 
  return {dialogWidth, dialogHeight};
}


/**
* A function that handles updating the Header text according to which step of the game we are at.
*/
export const handleHeaderText = (step, main, opponent, headerText, timer, name) => {
  let title 
  if (main === 'Chat') { 
    step !== 22 ? title = `Playing with ${opponent}                00:${timer}` : title='Free Chat Zone'
  }
  else if ((main === 'Narrator' || main === 'NarratorWait') && name !== ''){ 
    title = `You are playing with ${opponent}`
  }
  else if ((main === 'MatchingScreen') && name !== ''){ 
    title = `Waiting to find opponent`
  }
  else {
    title = headerText
  }
  return title
}
