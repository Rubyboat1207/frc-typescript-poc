package frc.robot.JSInterop;

import java.util.ArrayList;

import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.caoccao.javet.values.reference.V8ValueObject;

import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class JSSubsystemWrapper extends SubsystemBase {
    static ArrayList<JSSubsystemWrapper> ss = new ArrayList<>();
    public V8ValueObject baseObject;


    public JSSubsystemWrapper(V8ValueObject base) {
        ss.add(this);
        try {
            this.baseObject = base.toClone();
            this.baseObject.invokeVoid("subsysInit", (V8Value) null);

            JSRobotUtil.registerPeriodic((V8ValueFunction) this.baseObject.get("periodic"));
        }catch(Exception e) {
            e.printStackTrace();
        }
    }

    public static JSSubsystemWrapper registerSubsystem(V8ValueObject command) {
        JSSubsystemWrapper commandWrapper = new JSSubsystemWrapper(command);

        return commandWrapper;
    }
    
}
