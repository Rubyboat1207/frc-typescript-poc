package frc.robot.JSInterop;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.values.reference.V8ValueGlobalObject;
import com.ctre.phoenix.motorcontrol.can.WPI_TalonFX;
import com.swervedrivespecialties.swervelib.MechanicalConfiguration;
import com.swervedrivespecialties.swervelib.MkModuleConfiguration;
import com.swervedrivespecialties.swervelib.MkSwerveModuleBuilder;
import com.swervedrivespecialties.swervelib.MotorType;
import com.swervedrivespecialties.swervelib.SdsModuleConfigurations;
import com.swervedrivespecialties.swervelib.SwerveModule;

import edu.wpi.first.math.estimator.SwerveDrivePoseEstimator;
import edu.wpi.first.math.geometry.Rotation2d;
import edu.wpi.first.math.geometry.Translation2d;
import edu.wpi.first.math.kinematics.ChassisSpeeds;
import edu.wpi.first.math.kinematics.SwerveDriveKinematics;
import edu.wpi.first.math.kinematics.SwerveModulePosition;
import edu.wpi.first.math.kinematics.SwerveModuleState;
import edu.wpi.first.wpilibj.motorcontrol.MotorController;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.button.CommandXboxController;

public class ProxyConversion {
    private static V8ValueGlobalObject global;

    public static void register(V8ValueGlobalObject globalObject) throws JavetException {
        global = globalObject;
        // Wrappers
        global.set("JSCommandWrapper", JSCommandWrapper.class);
        global.set("JSSubsystemWrapper", JSSubsystemWrapper.class);

        // WPILib
        registerSimple(SmartDashboard.class);
        registerSimple(CommandXboxController.class);
        registerSimple(SwerveDriveKinematics.class);
        registerSimple(Translation2d.class);
        registerSimple(SwerveDrivePoseEstimator.class);
        registerSimple(SwerveModule.class);
        registerSimple(MotorType.class);
        registerSimple(ChassisSpeeds.class);
        registerSimple(MkModuleConfiguration.class);
        registerSimple(MkSwerveModuleBuilder.class);
        registerSimple(MechanicalConfiguration.class);
        registerSimple(SdsModuleConfigurations.class);
        registerSimple(SwerveModulePosition.class);
        registerSimple(MotorController.class);
        registerSimple(WPI_TalonFX.class);
        registerSimple(SwerveModuleState.class);
        registerSimple(Rotation2d.class);

        // Utilities
        global.set("RobotUtil", JSRobotUtil.class);
    }

    private static void registerSimple(Class<?> clazz) throws JavetException {
        global.set(clazz.getSimpleName(), clazz);
    }
}
