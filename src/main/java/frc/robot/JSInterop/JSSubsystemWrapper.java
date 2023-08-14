package frc.robot.JSInterop;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.reference.V8ValueObject;

import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class JSSubsystemWrapper extends SubsystemBase {

    public V8ValueObject subsystem;

    public JSSubsystemWrapper(V8ValueObject subsystem) {
        try {
            this.subsystem = subsystem.toClone();
            this.subsystem.invokeVoid("subsysInit", this);
        } catch (JavetException e) {
            e.printStackTrace();
        }
    }

    public static JSSubsystemWrapper registerSubsystem(V8ValueObject command) {
        JSSubsystemWrapper commandWrapper = new JSSubsystemWrapper(command);

        return commandWrapper;
    }

    @Override
    public void periodic() {
        try {
            subsystem.invokeVoid("periodic", this);
        } catch (JavetException e) {
            e.printStackTrace();
        }
    }
    
}
