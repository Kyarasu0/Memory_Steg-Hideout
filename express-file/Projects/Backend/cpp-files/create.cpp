// 標準入出力用
#include <iostream>
// ファイル入出力用
#include <fstream>
// ファイル/ディレクトリ操作用
#include <filesystem>
// 動的に配列を操作する用
#include <vector>
// 文字列操作用
#include <string>
// C言語ライブラリ
#include <cstdlib>
// json操作用
#include <nlohmann/json.hpp>

// 名前空間の別名
namespace fs = std::filesystem;
// 型の別名
using json = nlohmann::json;

int main(int argc, char* argv[]){
    if (argc < 5){
        // cerr: character error stream, endl: end line
        std::cerr << "Usage: create <inputDir> <outputDir> <dailyJSON> <titleJSON>" << std::endl;
        // 異常終了
        return -1;
    }

    // 引数をそれぞれ変数に代入
    std::string inputDir = argv[1];
    std::string outputDir = argv[2];
    std::string dailyJSON = argv[3];
    std::string titleJSON = argv[4];
    
    // 必要があればjsonでパース
    std::vector<std::string> dailyArr = json::parse(dailyJSON);
    std::vector<std::string> titleArr = json::parse(titleJSON);

    // pathの配列
    std::vector<fs::path> files;
    for (const auto& entry : fs::directory_iterator(inputDir)) {
        // 通常のファイルかを確認(ディレクトリなどを除外)
        if (entry.is_regular_file() && (entry.path().extension() == ".jpg" ||  entry.path().extension() == ".jpeg" || entry.path().extension() == ".JPG")) {
            // 通常のファイルかを確認出来たらpathを配列に追加
            files.push_back(entry.path());
        }
    }

    for (size_t i = 0; i < files.size(); ++i){
        // 埋め込み用の情報を取得
        std::string dailyText = (i < dailyArr.size()) ? dailyArr[i] : "";
        std::string titleText = (i < titleArr.size()) ? titleArr[i] : "";

        // 置換処理
        for (auto &c : titleText) {
            if (c == '/' || c == '\\' || c == ':' || c == '*' || c == '?' || c == '"' || c == '<' || c == '>' || c == '|')
                c = '_';
        }

        // ファイルのパスを定義
        if (titleText.empty()) titleText = "untitled_" + std::to_string(i);
        fs::path outputFile = fs::path(outputDir) / (titleText + ".jpg");

        // txtファイルを定義
        std::string tempTextFile = outputFile.stem().string() + ".txt";
        // ファイルを取得
        std::ofstream ofs(tempTextFile);
        // ファイルに書き込み
        ofs << dailyText;
        // ファイルを閉じる
        ofs.close();

        // steghideコマンドを実行
        std::string cmd = "steghide embed -cf \"" + files[i].string() + "\" -ef \"" + tempTextFile + "\" -sf \"" + outputFile.string() + "\" -p \"\" -q";

        //終了を告知、cout: character output
        std::cout << "Executing: " << cmd << std::endl;

        // コマンドを実行
        int ret = system(cmd.c_str());
        if (ret == 0){
            std::cout << "Steghide success for file: " << files[i] << std::endl;
        }else{
            std::cout << "Steghide failed for file: " << files[i] << std::endl;
        }

        // テキストファイルを削除
        fs::remove(tempTextFile);
    }

    return 0;
}
