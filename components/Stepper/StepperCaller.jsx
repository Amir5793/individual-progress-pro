"use client"
import React from "react";
import {useState} from "react";
import Stepper, {Step} from './Stepper';
import {Input} from "@/components/fundamentals/Input/Input";
// import Antigravity from "@/components/Antigravity/Antigravity
import DatePicker from "@/components/Calendar/DatePicker";

import "./StepperCaller.css"
import {CheckBox} from "@/components/fundamentals/CheckBox/CheckBox";
import {DropDown} from "@/components/fundamentals/DropDown/DropDown";
import {TagsCard} from "@/components/fundamentals/TagsCard/TagsCard";


export const StepperCaller = () => {
    const [isIndicatorActive, setIndicator] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    return (


        <Stepper
            disableStepIndicators={isIndicatorActive}
            initialStep={1}
            onStepChange={(step) => {
                console.log(step);
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
        >
            <Step>
                <h1>What do you want to accomplish?</h1>
                <Input placeholder="e.g. Finish Chapter 4 of React Course"
                       hintTxt={"Describe the outcome you’re aiming for."}></Input>
            </Step>
            <Step>
                <h1>Why is this important?</h1>
                <Input placeholder="e.g. Needed for my portfolio to get a job"
                       hintTxt={"Write a short reason that reminds you of your motivation."}></Input>
            </Step>
            <Step>
                <h1>How will you know you’re done?</h1>
                <Input placeholder="e.g. Pass all unit tests for FormComponent"
                       hintTxt={"Specify a clear finish line."}></Input>
            </Step>
            <Step>
                <h1>How difficult does it feel?</h1>
                <div className="checkbox-container">
                    <CheckBox name="difficulty" value="low"></CheckBox>
                    <CheckBox name="difficulty" value="medium"></CheckBox>
                    <CheckBox name="difficulty" value="hard"></CheckBox>
                    <CheckBox name="difficulty" value="almost impossible"></CheckBox>
                </div>
            </Step>
            <Step>
                <h1>How much focus will you need?</h1>
                <div className="checkbox-container">
                    <CheckBox name="energy" value="low"></CheckBox>
                    <CheckBox name="energy" value="medium"></CheckBox>
                    <CheckBox name="energy" value="much"></CheckBox>
                    <CheckBox name="energy" value="life or death"></CheckBox>
                </div>
            </Step>
            <Step>
                <h1>When would you like to finish?</h1>
                {/*  use a map here  */}

                {/*  recommended  */}
                <div className="date-picker-container">
                    <div className="date-picker-checkbox-container">
                        <CheckBox name="time" value="No deadline"></CheckBox>
                        <CheckBox name="time" value="tomorrow"></CheckBox>
                        <CheckBox name="time" value="this week"></CheckBox>
                        <CheckBox name="time" value="pick a date" func={() => {
                            setShowCalendar(true)
                        }}></CheckBox>
                    </div>
                    <div>
                        {showCalendar && <DatePicker></DatePicker>}
                    </div>
                </div>


            </Step>

            <Step>
                <h1>Which area of life does this belong to?</h1>

                <div className="tags-container">
                    <TagsCard tags={['te', 'hee']}></TagsCard>
                </div>
            </Step>

            TODO add a if, then step here later

            TODO add the complication

        </Stepper>)
}

