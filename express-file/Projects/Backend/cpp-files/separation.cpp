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
    if (argc < 2){
        // cerr: character error stream, endl: end line
        std::cerr << "Usage: separation <imagefullpath>" << std::endl;
        // 異常終了
        return -1;
    }

    // 引数をそれぞれ変数に代入
    fs::path file = argv[1];
    
    // ファイルが存在するか確認
    if (!fs::exists(file) || !fs::is_regular_file(file)) {
        std::cerr << "Error: file does not exist -> " << file << std::endl;
        return -1;
    }

    // 拡張子チェック
    std::string ext = file.extension().string();
    if (!(ext == ".jpg" || ext == ".jpeg" || ext == ".JPG")) {
        std::cerr << "Error: not a supported image file -> " << file << std::endl;
        return -1;
    }

    std::cout << "----- Extracting from: " << file << " -----" << std::endl;

    // steghide extract（出力先指定なし → stdoutに出る）
    std::string cmd = "steghide extract -sf \"" + file.string() + "\" -p \"\" -f";

        // コマンドを実行
        int ret = system(cmd.c_str());
        if (ret != 0){
            std::cerr << "Steghide extract failed for file: " << file << std::endl;
        }

        std::cout << "-----------------------------------------------" << std::endl;
    return 0;
}