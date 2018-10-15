import jsonp from 'common/js/jsonp'
import {commonParams, options} from "./config"
import Axios from 'axios'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });

  return jsonp(url, data, options);
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  });

  return jsonp(url, data, options)
}

export function getSingerMusic(id) {
  const url = '/api/music';
  // let url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

  const data = {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: id,
    filename: `C400${id}.m4a`,
    guid: 6623027863
  };

  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
