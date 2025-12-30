<?php

namespace VerifyLogin;

use pocketmine\plugin\PluginBase;
use pocketmine\command\Command;
use pocketmine\command\CommandSender;
use pocketmine\player\Player;
use pocketmine\utils\TextFormat;

class Main extends PluginBase {

    // 🔴 改成你的網站
    private string $verifyUrl = "http://proxy.twdevs.com/auth/verify";

    public function onCommand(CommandSender $sender, Command $command, string $label, array $args): bool {

        if (!$sender instanceof Player) {
            $sender->sendMessage("請在遊戲內使用此指令");
            return true;
        }

        if (count($args) !== 1) {
            $sender->sendMessage(TextFormat::RED . "用法：/verify <驗證碼>");
            return true;
        }

        $player = $sender;
        $code = $args[0];

        $player->sendMessage(TextFormat::GRAY . "驗證中，請稍候...");

        $data = json_encode([
            "code" => $code,
            "username" => $player->getName()
        ]);

        $context = stream_context_create([
            "http" => [
                "method"  => "POST",
                "header"  => "Content-Type: application/json\r\n",
                "content" => $data,
                "timeout" => 5
            ]
        ]);

        $result = @file_get_contents($this->verifyUrl, false, $context);

        if ($result === false) {
            $player->sendMessage(TextFormat::RED . "驗證失敗（可能已過期或錯誤）");
            return true;
        }

        $response = json_decode($result, true);

        if (isset($response["success"]) && $response["success"]) {
            $player->sendMessage(TextFormat::GREEN . "驗證成功！請回到網站完成登入");
        } else {
            $player->sendMessage(TextFormat::RED . "驗證碼錯誤或已過期");
        }

        return true;
    }
}
