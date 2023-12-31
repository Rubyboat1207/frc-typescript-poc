package frc.robot.JSInterop;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interfaces.IJavetUniConsumer;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueArray;
import com.caoccao.javet.values.reference.V8ValueObject;

import edu.wpi.first.wpilibj2.command.CommandBase;

public class JSCommandWrapper extends CommandBase {
    public V8ValueObject baseObject;

    public JSCommandWrapper(V8ValueObject base) {
        try {
            this.baseObject = base.toClone();
            this.baseObject.clearWeak();
            this.baseObject.set("addRequirements", addRequirements);
        }catch(Exception e) {
            e.printStackTrace();
        }
    }


    public static JSCommandWrapper createJCommand(V8ValueObject command) {
        JSCommandWrapper commandWrapper = new JSCommandWrapper(command);

        return commandWrapper;
    }

    IJavetUniConsumer<V8ValueArray, Exception> addRequirements = (requirements) -> {
        for(int i = 0; i < requirements.getLength(); i++) {
            var subsystem_ref = (V8ValueObject) requirements.get(i);
            
            System.out.println(subsystem_ref);
        }
    };

    @Override
    public void initialize() {
        System.out.println("Initalized!");

        try {
            baseObject.invokeVoid("initialize", (V8Value) null);
        } catch (JavetException e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean isFinished() {
        try {
            return baseObject.invokeBoolean("isFinished", (V8Value) null);
        } catch (JavetException e) {
            e.printStackTrace();
        }
        return true;
    }

    @Override
    public void execute() {
        try {
            baseObject.invokeVoid("execute", (V8Value) null);
        } catch (JavetException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void end(boolean interrupted) {
        try {
            baseObject.invokeVoid("end", interrupted);
        } catch (JavetException e) {
            e.printStackTrace();
        }
    }
}
