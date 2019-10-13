#include <napi.h>
#include "bmp2json.h"

using namespace Napi;

typedef unsigned int uint;

/*
Array vectorToJsArray(Env env, vector<vector<float>>& matrix) {
  const uint height = matrix.size();
  float arr2[] = { 0, 1, 2 };

  Array arr = Array::New(env, 10);
  // arr.Set(0, arr2);
  arr -> set(0, 1);
  return arr;

  // const uint width = matrix[0].size();

  // Object obj = Object::New(env);
  //
  // for (uint i = 0; i < height; i++) {
  //   // double* row = &matrix.at(0);
  //   double row[] = { 0.1, 0.2, 0.3 };
  //
  //   Array napi_row = Array(row);
  //
  //   obj.Set(i, napi_row);
  // }

}
*/

Napi::String Convert(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  const string INPUT_IMG_SRC = info[0].As<Napi::String>();
  const uint DIVISOR = info[1].As<Napi::Number>();

  string brightArr = bmp2json::bitmapImageToJsonArray(INPUT_IMG_SRC, DIVISOR);
  Napi::String output = Napi::String::New(env, brightArr);

  return output;
}

Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(String::New(env, "convert"), Function::New(env, Convert));
  return exports;
}

NODE_API_MODULE(bmp2json, Init)
