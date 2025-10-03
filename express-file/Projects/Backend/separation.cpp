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
  // #include <nlohmann/json.hpp>

// 名前空間の別名
namespace fs = std::filesystem;
// 型の別名
  // using json = nlohmann::json;

int main(int argc, char* argv[]){
    if (argc < 3){
        // cerr: character error stream, endl: end line
        std::cerr << "Usage: separation <imagefullpath> <output>" << std::endl;
        // 異常終了
        return -1;
    }

    // 引数をそれぞれ変数に代入
    std::string imagefullpath = argv[1];
    std::string output = argv[2];

    // pathの配列
    std::vector<fs::path> files;
    for (const auto& entry : fs::directory_iterator(imagefullpath)) {
        // 通常のファイルかを確認(ディレクトリなどを除外)
        if (entry.is_regular_file() && (entry.path().extension() == ".jpg" ||  entry.path().extension() == ".jpeg" || entry.path().extension() == ".JPG")) {
            // 通常のファイルかを確認出来たらpathを配列に追加
            files.push_back(entry.path());
        }
    }

    for (size_t i = 0; i < files.size(); ++i){

        // 元画像をコピー
        fs::path outputImage = fs::path(output) / files[i].filename();
        fs::copy_file(files[i], outputImage, fs::copy_options::overwrite_existing);

        // 日記を出力するファイル名
        fs::path output = fs::path(output) / (files[i].stem().string() + "_diary.txt");

        // steghideコマンドを実行
        std::string cmd = "steghide extract -sf \"" + files[i].string() + "\" -xf \"" + (output.stem().string() + ".txt") + "\" -p \"\" -q";


        //終了を告知、cout: character output(理由不明)
        std::cout << "Executing: " << cmd << std::endl;

        // コマンドを実行
        int ret = system(cmd.c_str());
        if (ret == 0){
            std::cout << "Steghide success for file: " << files[i] << std::endl;
        }else{
            std::cout << "Steghide failed for file: " << files[i] << std::endl;
        }
    }
    return 0;
}