#include <iostream>
#include <fstream>
#include <filesystem>
#include <cstdlib>

namespace fs = std::filesystem;

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: separation <imagefullpath>" << std::endl;
        return -1;
    }

    fs::path file = argv[1];

    if (!fs::exists(file) || !fs::is_regular_file(file)) {
        std::cerr << "Error: file does not exist -> " << file << std::endl;
        return -1;
    }

    std::string ext = file.extension().string();
    if (!(ext == ".jpg" || ext == ".jpeg" || ext == ".JPG")) {
        std::cerr << "Error: not a supported image file -> " << file << std::endl;
        return -1;
    }

    // 一時的に出力ファイルを作る
    fs::path tmpFile = fs::temp_directory_path() / "extracted.txt";

    // steghide extract コマンドを作る（出力先を tmpFile に指定）
    std::string cmd = "steghide extract -sf \"" + file.string() + "\" -p \"\" -xf \"" + tmpFile.string() + "\" -f 2>/dev/null";

    // コマンド実行
    int ret = system(cmd.c_str());
    if (ret != 0) {
        std::cerr << "Steghide extract failed for file: " << file << std::endl;
        return -1;
    }

    // 抽出したファイルが存在するか確認
    if (!fs::exists(tmpFile)) {
        std::cerr << "No embedded data found in: " << file << std::endl;
        return -1;
    }

    // 抽出したファイルの中身を表示
    std::ifstream in(tmpFile);
    if (!in) {
        std::cerr << "Failed to open extracted file" << std::endl;
        return -1;
    }

    std::string line;
    while (std::getline(in, line)) {
        std::cout << line << std::endl;  // これだけを出力
    }

    in.close();

    // 一時ファイルを削除
    fs::remove(tmpFile);

    return 0;
}
