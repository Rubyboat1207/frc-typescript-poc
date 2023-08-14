// Copyright (c) FIRST and other WPILib contributors.
// Open Source Software; you can modify and/or share it under the terms of
// the WPILib BSD license file in the root directory of this project.

package frc.robot;

import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interception.logging.JavetStandardConsoleInterceptor;
import com.caoccao.javet.interop.V8Host;
import com.caoccao.javet.interop.V8Runtime;
import com.caoccao.javet.interop.converters.JavetProxyConverter;

import frc.robot.JSInterop.JSRobotUtil;
import frc.robot.JSInterop.ProxyConversion;



public class RobotContainer {
  public static V8Runtime runtime;

  public RobotContainer() {
    configureBindings();
    try {
      runtime = V8Host.getV8Instance().createV8Runtime();
      runtime.setConverter(new JavetProxyConverter());
      new JavetStandardConsoleInterceptor(runtime).register(runtime.getGlobalObject());

      ProxyConversion.register(runtime.getGlobalObject());
      
    }catch(Exception e) {
      e.printStackTrace();
      System.out.println("V8 RUNTIME FAILED TO START, PLEASE REBOOT");
    }

    try {
      runtime.getExecutor(TypescriptHandler.getTypescriptFile("main").get()).executeVoid();
    } catch (JavetException e) {
      e.printStackTrace();
    }

    
  }

  private void configureBindings() {
    
  }

  public void teleopPeriodic() {
    JSRobotUtil.runPeriodics();
  }
}
