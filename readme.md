# Typescript FRC WPILIB Robot
This is a proof of concept for including the V8 engine into a frc robot. This currently works on my windows 11 Sim gui. I haven't as of yet tested this on a real robot, but i will soon.

---
## Install Instructions
On the deploy machine, you must have the typescript compiler installed. It can be installed with
```
npm install -g typescript
```
Then all you need to do is deploy like normal and the typescript code should be compiled to JS, and then written to the robot.

## Where is the typescript?
The typescript is stored in the deploy folder. It is then compiled to the compiledJS folder, which does not need to be checked in to version control.

## Limitations
- This is a java based project
- The javascript does not automatically have access to all Java variables / Classes
- All typescript commands must be manually converted into a ``JCommand``
    - some body more experineced in javet would probably be able to find a way around this
- All typescript subsystems must be converted into a ``JSSubsystemWrapper``

## This interface is awful.
I get it, this clearly isnt a final design for typescript on wpilib, but if you would like to make it better, I am fully open to contributions, and I would be honored to be the basis for your own project. 
