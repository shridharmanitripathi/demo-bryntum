new Button({
    appendTo : targetElement,
    text     : 'Click me for a riddle!',
    onClick  : async({ source : btn }) => {
        const result = await MessageDialog.confirm({
            title   : 'The big question',
            message : 'Do one legged ducks swim in circles?'
        });

        Toast.show(`You answered ${result === MessageDialog.yesButton ? 'Yes' : 'No'}`);
    }
});
