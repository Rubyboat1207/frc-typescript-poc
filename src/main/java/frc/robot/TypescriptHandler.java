package frc.robot;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.util.Optional;

import edu.wpi.first.wpilibj.Filesystem;

public class TypescriptHandler {
    public static Optional<String> getTypescriptFile(String path) {

        var jspath = Path.of(Filesystem.getDeployDirectory() + "/compiledJS/" + path + ".js");

        if(!Files.exists(jspath, LinkOption.NOFOLLOW_LINKS)) {
            return Optional.empty();
        }

        try {
            return Optional.of(Files.readString(jspath));
        } catch (IOException e) {
            return Optional.empty();
        }
    }
}
