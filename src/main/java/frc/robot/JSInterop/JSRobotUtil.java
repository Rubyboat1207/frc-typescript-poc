package frc.robot.JSInterop;

import java.util.ArrayList;
import java.util.List;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.V8Value;
import com.caoccao.javet.values.reference.V8ValueFunction;
import com.ctre.phoenix.motorcontrol.can.WPI_TalonFX;

import edu.wpi.first.wpilibj.motorcontrol.MotorController;

public class JSRobotUtil {
    static List<V8ValueFunction> occurPeriodically = new ArrayList<>();


    public static void registerPeriodic(V8ValueFunction periodic) {
        occurPeriodically.add(periodic);
    }

    public static void runPeriodics() {
        occurPeriodically.forEach(f -> {
            try {
                f.callVoid(f, (V8Value) null);
            } catch (JavetException e) {
                e.printStackTrace();
            }
        });
    }

    public static WPI_TalonFX fromMotorController(MotorController motorController) {
        return (WPI_TalonFX) motorController;
    }
}
