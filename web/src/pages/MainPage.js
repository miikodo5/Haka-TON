import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, AppBar, Toolbar, Stepper, StepLabel, Step, Paper, StepContent, IconButton, Avatar } from '@mui/material'
import { RouteNames } from '../router';
import toncoinIcon from '../assets/toncoinIcon.png';
import sendIcon from '../assets/sendIcon.png';

const steps = [
    {
      label: 'Idea ?',
      description: `What is the point of idea ? Let's describe it!`,
    },
    {
      label: 'What is RenTON',
      description:
        'RenTON is a crypto rent ....',
    },
    {
      label: 'Difference with other common rent cervices ',
      description: `It's quite better!!!`,
    },
];

const MainPage = () => {
    const router = useNavigate();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        // <AppBar component="main" position='fixed' style={{marginTop: 10, height: '100%', zIndex: -1}}>
        <Box sx={{ marginTop: 10, marginLeft: 10, maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
            <Step key={step.label}>
                <StepLabel
                optional={
                    index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                    ) : null
                }
                >
                {step.label}
                </StepLabel>
                <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                    <div>
                        {index === steps.length - 1 ? 

                            <Button
                                variant="contained"
                                // color='primary'
                                style={{background: '#0088cc'}}
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                                startIcon={<Avatar src={toncoinIcon} style={{height: 20, width: 20, border: 'solid white'}} />}
                            >
                                Got it
                            </Button>
                            :
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                Continue
                            </Button>
                        }
                        
                        <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            Back
                        </Button>
                    </div>
                </Box>
                </StepContent>
            </Step>
            ))}
        </Stepper>
        {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Let&apos;s try !</Typography>
            <Button 
                onClick={() => router(RouteNames.MAP)} 
                sx={{ mt: 1, mr: 1 }} 
                variant="outlined"
                endIcon={<Avatar src={sendIcon} style={{height: 20, width: 20, border: 'solid white', background: 'white'}} />}
            >
                Go to map
            </Button>
            </Paper>
        )}
        </Box>
        // </AppBar>
    );
};

// const MainPage = () => {
//     const steps = [
//         'Join RenTON',
//         'Open map',
//         'Select vehicle',
//         'Start ride',
//         'Have fun',
//       ];
//     return (
//         <AppBar component="main" position='fixed' style={{marginTop: 0, height: '100%', zIndex: -1}}>
//             <Box sx={{ width: '100%', marginTop: '30%' }}>
//                 <Stepper activeStep={0} alternativeLabel style={{background: 'white', paddingTop: 10, paddingBottom: 10}}>
//                     {steps.map((label) => (
//                     <Step key={label} sx={{borderColor: 'red'}}>
//                         <StepLabel>{label}</StepLabel>
//                     </Step>
//                     ))}
//                 </Stepper>
//             </Box>
//         </AppBar>
//     );
// };

export default MainPage;
