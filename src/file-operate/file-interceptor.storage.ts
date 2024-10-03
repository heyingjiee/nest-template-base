import * as multer from 'multer';
import * as dayjs from 'dayjs';
import * as uuid from 'uuid';
import appConfig from '../common/configs/config';

const storage = multer.diskStorage({
  // 文件目录(相对项目根目录)。也支持函数形式，与filename字段函数类型一直，通过file参数可以拿到源文件信息
  destination: `${appConfig.uploadDir}/${dayjs().format('YYYY-MM-DD')}`,
  filename: function (req, file, cb) {
    const uniqueFilename = uuid.v4() + '-' + file.originalname; // originalname 文件原名（带后缀）
    cb(null, uniqueFilename); // 文件名
  },
});

export { storage };
