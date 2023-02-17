import React from 'react';

class Demo extends React.Component {
    sum(a,b,c)  
    {
        return a + b + c; 
    }

    testSpread()
    {
        const arr = [1, 2, 3];
        const sum = this.sum(...arr);
        const sum1 = this.sum.apply(null, arr);

        let message = {text: 'Hello world!', color: 'red'};
        let message2 = {...message, color: 'blue'};
        let message3 = {...message, text: 'Hello world 2!'};
    }

    displayMessage(message) 
    {
        alert(message);
    }

    render() 
    {
        return(
            <button onClick={ () => this.displayMessage('Clicked button!') }>Click me!</button>
        );
    }
}

export default Demo;