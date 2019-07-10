#include <cstdio>
#include <string>
#include <sstream>
#include <iomanip>
#include <fstream>
#include <cstdlib>
#include "lib/bitmap/bitmap_image.hpp"

using std::cout;
using std::cerr;
using std::endl;
using std::vector;
using std::string;
using std::ofstream;

typedef unsigned int uint;

namespace bmp2json {
  //  FUNCTIONS ////////////////////////////////////////////////////////////////
  // Returns 2d pixel array extracted by the bitmap_image library
  bitmap_image getImg(string img_src) {
    bitmap_image img(img_src);
    if (!img) {
      cerr << "Couldn't open image" << endl;
    } else {
      return img;
    }
  }

  // Returns the two dimensional vector matrix
  // in which RGB values are summed
  vector<vector<uint> > getBrightPixelMatrix(bitmap_image *img) {
    const uint height = img -> height();
    const uint width = img -> width();
    cout << endl << height << " " << width << endl << endl;
    vector<vector<uint>> bright_pixel_matrix;

    for (size_t i = 0; i < height; i++) {
      vector<uint> bright_pixel_matrix_row;

      for (size_t j = 0; j < width; j++) {
        rgb_t colour;
        img -> get_pixel(j, i, colour);
        uint brightness = (colour.red + colour.green + colour.blue);

        bright_pixel_matrix_row.push_back(brightness);
      }
      bright_pixel_matrix.push_back(bright_pixel_matrix_row);
    }

    return bright_pixel_matrix;
  }

  // Takes "divisor" number of adjacent cells of the matrix
  // and adds them toghether: e.g [[2][3][4]] -> [[9]]
  void reduceMatrixRows(vector<vector<uint>> &matrix, uint divisor) {
    const uint height = matrix.size();
    const uint width = matrix[0].size();

    vector<vector<uint>> row_reduced_matrix;

    for (uint i = 0; i < height; i++) {

      vector<uint> row_reduced_matrix_row;
      float brightness_sum = 0;

      for (uint j = 0; j < width; j++) {
        float brightness = matrix[i][j];
        brightness_sum += brightness;

        if (j && j % divisor == 0) {
          row_reduced_matrix_row.push_back(brightness_sum);
          brightness_sum = 0;
        }
      }
      row_reduced_matrix.push_back(row_reduced_matrix_row);
      row_reduced_matrix_row.clear();
    }

    matrix = row_reduced_matrix;
  }

  // Switches rows and columns of the 2d matrix
  void transposeMatrix(vector<vector<uint>> &matrix) {
    vector<vector<uint>> trans_matrix(matrix[0].size(), vector<uint>());

    for (uint i = 0; i < matrix.size(); i++) {
      for (uint j = 0; j < matrix[i].size(); j++) {
        trans_matrix[j].push_back(matrix[i][j]);
      }
    }

    matrix = trans_matrix;
  }

  // Returns new matrix with each cell divided by (255 * 3) and "divisor"
  // squared to finish up scaling of the matrix started by
  // getBrightPixelMatrix() and reduceMatrixRows(), which was called two times
  vector<vector<float>> getDivMatrix(
    vector<vector<uint>> &matrix, uint divisor
  ) {
    vector<vector<float>> divided_matrix;

    for (uint i = 0; i < matrix.size(); i++) {
      vector<float> divided_matrix_row;
      for (uint j = 0; j < matrix[i].size(); j++) {
        float new_item = matrix[i][j] / (765.0 * pow(divisor, 2.0));
        divided_matrix_row.push_back(new_item);
      }
      divided_matrix.push_back(divided_matrix_row);
      divided_matrix_row.clear();
    }

    return divided_matrix;
  }

  //  Usefull for debugging purposes:
  void printMatrix(vector<vector<uint>> *matrix) {
    for (uint y = 0; y < matrix -> size(); y++) {
      vector<uint> *v = &matrix -> at(y);
      for (uint x = 0; x < v -> size(); x++) {
        cout << v -> at(x);
      }
      cout << endl;
    }
  }
  void printMatrix(vector<vector<float>> *matrix) {
    for (uint y = 0; y < matrix -> size(); y++) {
      vector<float> *v = &matrix -> at(y);
      for (uint x = 0; x < v -> size(); x++) {
        cout << v -> at(x) << " ";
      }
      cout << endl;
    }
  }

  // Forms a long concatenated string of brackets and brightness values
  // to form JSON array and returns the output as a string
  string matrixToJsonString(vector<vector<float>> *matrix) {
    string json_array = "const IMG = [\n";

    for (uint i = 0; i < matrix -> size(); ++i) {
      json_array += "[\n";

      vector<float> *v = &matrix -> at(i);
      for (uint j = 0; j < v -> size(); ++j) {

        std::ostringstream streamObj;
        streamObj << std::fixed;
        streamObj << std::setprecision(2);
        streamObj << v -> at(j);
        string rounded_brightness = streamObj.str();

        if (j == v -> size() - 1) {
          json_array += rounded_brightness;
        }
        else {
          json_array += rounded_brightness + ", ";
        }
      }

      if (i == matrix -> size() - 1) {
        json_array += "\n]";
      }
      else {
        json_array += "\n],\n";
      }
    }
    json_array += "\n]";

    return json_array;
  }

  //  Calls above methods to produce json array string
  string bitmapImageToJsonArray(string input, uint divisor) {
    bitmap_image img = getImg(input);
    vector<vector<uint>> pixel_matrix = getBrightPixelMatrix(&img);

    reduceMatrixRows(pixel_matrix, divisor);
    transposeMatrix(pixel_matrix);
    reduceMatrixRows(pixel_matrix, divisor);
    transposeMatrix(pixel_matrix);

    vector<vector<float>> output_matrix = getDivMatrix(pixel_matrix, divisor);
    return matrixToJsonString(&output_matrix);
  }

  void saveToFile(string filename, string *input) {
    string output_src = filename;
    ofstream OutputFile;
    OutputFile.open(output_src);
    OutputFile << *input;
    OutputFile.close();
  }
  //////////////////////////////////////////////////////////////////////////////
}


int main(int argc, char** argv) {
  /*
  Program takes a 24-bit bmp image (argv[1]), parses it to extract brightness
  values and divide it's size by the factor of "divisor".
  Then it saves the output 2d JSON array to the file (argv[2]).
  */
  if (argc < 2) {
    cerr << endl << "\tError" << endl << "\t  No input image provided"
    << endl << endl;
    return 1;
  }
  if (argc < 3) {
    cerr << endl << "\tError" << endl << "\t  No output file provided"
    << endl << endl;
    return 1;
  }
  if (argc < 4) {
    cerr << endl << "\tError" << endl << "\t  No divisor value provided"
    << endl << endl;
    return 1;
  }

  const string INPUT_IMG_SRC = string(argv[1]);
  const string OUTPUT_FILE_SRC = string(argv[2]);
  const uint DIVISOR = atoi(argv[3]);

  string OUTPUT_STRING = bmp2json::bitmapImageToJsonArray(
    INPUT_IMG_SRC, DIVISOR
  );

  bmp2json::saveToFile(OUTPUT_FILE_SRC, &OUTPUT_STRING);

  cout << endl << "\tSuccess!" << endl << "\t  Parsed \"" << argv[1]
  << "\" saved to file \"" << argv[2] << "\"" << endl << endl;

  return 0;
}
