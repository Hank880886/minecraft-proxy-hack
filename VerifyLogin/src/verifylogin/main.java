package verifylogin;

import cn.nukkit.plugin.PluginBase;
import cn.nukkit.command.Command;
import cn.nukkit.command.CommandSender;
import cn.nukkit.Player;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Main extends PluginBase {

    // ⚠️ 改成你的網站
    private static final String VERIFY_URL = "http://你的網站/auth/verify";

    @Override
    public void onEnable() {
        getLogger().info("VerifyLogin Plugin Enabled");
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {

        if (!(sender instanceof Player)) {
            sender.sendMessage("請在遊戲內使用此指令");
            return true;
        }

        if (args.length != 1) {
            sender.sendMessage("§c用法：/verify <驗證碼>");
            return true;
        }

        Player player = (Player) sender;
        String code = args[0];

        player.sendMessage("§7驗證中，請稍候...");

        new Thread(() -> {
            try {
                URL url = new URL(VERIFY_URL);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                conn.setRequestMethod("POST");
                conn.setDoOutput(true);
                conn.setRequestProperty("Content-Type", "application/json");

                String json = "{"
                        + "\"code\":\"" + code + "\","
                        + "\"username\":\"" + player.getName() + "\""
                        + "}";

                OutputStream os = conn.getOutputStream();
                os.write(json.getBytes());
                os.flush();

                int responseCode = conn.getResponseCode();

                if (responseCode == 200) {
                    player.sendMessage("§a驗證成功！請回到網站完成登入");
                } else {
                    player.sendMessage("§c驗證失敗，請確認驗證碼");
                }

            } catch (Exception e) {
                player.sendMessage("§c連線驗證伺服器失敗");
                getLogger().warning(e.getMessage());
            }
        }).start();

        return true;
    }
}
