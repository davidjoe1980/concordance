const router = require("express").Router();
const main_dao = require('../dao/main_dao');
const { upload, fileList } = require("../controller/file.controller");
const { songData, searchSongs, resultsData, searchSongsByMeta } = require("../controller/song.controller");
const { groupsData, updateGroupsData } = require("../controller/groups.controller");

const dao = new main_dao.dao();

router.post('/api/upload', upload);
router.get('/api/file_list', fileList);

router.get('/api/files', async (req, res) => {
    const result = await dao.getAllFiles();

    return res.status(200).send(result);
});

router.get('/api/admin/locations', async (req, res) => {
    const result = await dao.getLocationTypes();

    return res.status(200).send(result);
});

router.get('/api/admin/statistics', async (req, res) => {
    const result = await dao.getStatistics();

    return res.status(200).send(result);
});

router.post('/api/admin/locations', async (req, res) => {
    req.array.forEach(async (location) => {
        await dao.setLocationType(location); 
    });

    return res.status(200).send({
        message: "locations updated successfuly",
    });
});

router.get('/api/admin/file_metadata', async (req, res) => {
    const result = await dao.getFileMetadataTypes();

    return res.status(200).send(result);
});

router.get('/api/song', songData);

router.get('/api/search/song', searchSongs);

router.get('/api/search/meta', searchSongsByMeta);

router.post('/api/results', resultsData);

router.get('/api/group_data', groupsData);

router.post('/api/group_data', updateGroupsData);


module.exports = router;
