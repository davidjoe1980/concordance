const oracledb = require("oracledb");
const helper = require('../lib/daoHelper')
const dbConfig = require("../../config/db");

let connection;

(async () => {
    connection = await oracledb.getConnection(dbConfig);
})().catch(error => {
    console.log(error)
});

const binds = {};
const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    autoCommit: true,
    batchErrors: true,
};


class dao {
    async getAllFiles() {
        const sql = `SELECT *
                     FROM FILE_DATA`;

        try {
            const result = await connection.execute(sql, binds, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getSongData(fileId) {
        const sql = `SELECT *
                     FROM FILE_METADATA_VALUES
                     WHERE id = :fileId`;

        try {
            const result = await connection.execute(sql, [fileId], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getSongsByTerm(term) {
        const termArray = term.split(' ');
        const sql = `SELECT ft.*,
		            lead(location) over (partition by FILE_NAME order by location) as next_location
                    FROM FILE_TERMS ft
                    WHERE ft.LOCATION_TYPE_NAME = 'word'
                    AND ft.term IN (${termArray.map((termValue, index) => { return `:term${index}` }).join(',')})
                    ORDER BY ft.FILE_NAME, ft.LOCATION`;

        try {
            const result = await connection.execute(sql, termArray, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        } 
    }

    async getGroupTerms(group) {
        const sql = `SELECT tg.ID, tg.TERM_GROUP_NAME, ttg.TERM
                    FROM TERM_GROUPS tg 
                    JOIN TERM_TERM_GROUPS ttg ON ttg.TERM_GROUP_ID = tg.ID
                    WHERE tg.TERM_GROUP_NAME = :tg_name`;

        try {
            const result = await connection.execute(sql, [group], options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        } 
        
    }

    async getSongsByMeta(text) {
        const sql = `SELECT distinct fmv.*
                    FROM FILE_METADATA fm
                    JOIN METADATA me ON me.ID = fm.METADATA_ID 
                    JOIN METADATA_TYPES mte ON mte.ID = me.METADATA_TYPE_ID
                    JOIN FILE_METADATA_VALUES fmv ON fmv.ID = fm.FILE_ID 
                    WHERE me.METADATA_VALUE LIKE '%${text}%'`;

        try {
            const result = await connection.execute(sql, [], options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        } 
    }

    async getSongsLineByOccurrence(termOccurrenceId) {
        const sql = `SELECT ft.*, fmv.METADATA_JSON, lst.STATISTICS_JSON 
                    FROM FILE_TERMS ft
                    JOIN FILE_METADATA_VALUES fmv ON fmv.ID = ft.FILE_ID 
                    JOIN LOCATION_STATISTIC_VALUES lst ON lst.ID  = ft.LOCATION_ID 
                    WHERE ft.term_occurrence_id = :term_occurrence_id`;

        try {
            const result = await connection.execute(sql, [termOccurrenceId], options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        } 
    }

    async getLocationTypes() {
        const sql = `SELECT *
                     FROM LOCATION_TYPES`;

        try {
            const result = await connection.execute(sql, binds, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getFileMetadataTypes() {
        const sql = `SELECT *
                     FROM METADATA_TYPES`;

        try {
            const result = await connection.execute(sql, binds, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async setLocationType(location_type) {
        const sql = `MERGE INTO LOCATION_TYPES lt
                    USING (
                        SELECT :location_type_name, :regex, :regex_flags from dual
                    ) elt
                    ON (elt.location_type_name = lt.location_type_name)
                    WHEN MATCHED THEN UPDATE SET lt.regex = elt.regex, lt.regex_flags = elt.regex_flags
                    WHEN NOT MATCHED THEN INSERT (location_type_name, regex, regex_flags) VALUES (elt.location_type_name, elt.regex, elt.regex_flags)`;

        try {
            await connection.execute(sql, [location_type.location_type_name, location_type.regex, location_type.regex_flags], options)
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getFileByRowid(rowid) {
        const sql = `SELECT *
                     FROM FILE_DATA
                     WHERE rowid = :id`;

        try {
            const result = await connection.execute(sql, [rowid], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getLocations() {
        const sql = `SELECT *
                     FROM LOCATION_TYPES`;

        try {
            const result = await connection.execute(sql, binds, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getStatistics() {
        const sql = `SELECT *
                     FROM STATISTIC_TYPES`;

        try {
            const result = await connection.execute(sql, binds, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async saveFile(filePath, fileName) {
        const sql = `INSERT INTO FILE_DATA (file_path, file_name)
                     VALUES (:filePath, :fileName)`;

        try {
            const res = await connection.execute(sql, [filePath, fileName], options);
            const file = await this.getFileByRowid(res.lastRowid);

            return file;
        } catch (error) {
            console.log(error.message);
            console.log(sql)
        }
    }

    async getMetadataByRowid(rowid) {
        const sql = `SELECT *
                     FROM METADATA
                     WHERE rowid = :id`;

        try {
            const result = await connection.execute(sql, [rowid], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async saveFileMetadata(metadata_id, file_id) {
        const sql = `INSERT INTO FILE_METADATA (file_id, metadata_id)
                     VALUES (:fileId, :metadataId)`;

        try {
            await connection.execute(sql, [file_id, metadata_id], options);
        } catch (error) {
            console.log(error.message);
        }
    }

    async saveMetadata(fileId, metadata) {
        const sql = `INSERT INTO METADATA (metadata_type_id, metadata_value)
                    VALUES (:metadata_type_id, :metadata_value)`;

        Object.keys(metadata).forEach(async (metadata_type_id) => {
            try {
                const res = await connection.execute(sql, [metadata_type_id, metadata[metadata_type_id]], options);
                const meta = await this.getMetadataByRowid(res.lastRowid);
                await this.saveFileMetadata(meta.id, fileId);
            } catch (error) {
                console.log(error.message);
            }
        });
    }

    async getTermByRowid(rowid) {
        const sql = `SELECT *
                     FROM TERMS
                     WHERE rowid = :termRowId`;

        try {
            const result = await connection.execute(sql, [rowid], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getTermOccurenceByRowid(rowid) {
        const sql = `SELECT *
                     FROM TERM_OCCURRENCES
                     WHERE rowid = :termRowId`;

        try {
            const result = await connection.execute(sql, [rowid], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getLocationByRowid(rowid) {
        const sql = `SELECT *
                     FROM LOCATIONS
                     WHERE rowid = :termRowId`;

        try {
            const result = await connection.execute(sql, [rowid], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getTerm(word) {
        const sql = `SELECT *
                     FROM TERMS
                     WHERE term = :term`;

        try {
            const result = await connection.execute(sql, [word], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async saveTerm(word) {
        const sql = `INSERT INTO TERMS (term)
                     VALUES (:term)`;

        try {
            const res = await connection.execute(sql, [word], options);
            const term = await this.getTermByRowid(res.lastRowid);
            return term;
        } catch (error) {
            return await this.getTerm(word);
        }
    }

    async saveTermOccurence(termId) {
        const sql = `INSERT INTO TERM_OCCURRENCES (term_id)
                     VALUES (:termId)`;

        try {
            const res = await connection.execute(sql, [termId], options);
            const termOccurence = await this.getTermOccurenceByRowid(res.lastRowid);
            return termOccurence;
        } catch (error) {
            console.log(error.message);
            console.log(sql);
        }
    }

    async saveTermLocation(fileId, locationType, location) {
        const sql = `INSERT INTO LOCATIONS (file_id, location_type, location)
                     VALUES (:fileId, :locationType, :locationType)`;

        try {
            const res = await connection.execute(sql, [fileId, locationType, location], options);
            const locationData = await this.getLocationByRowid(res.lastRowid);
            return locationData;
        } catch (error) {
            console.log(error.message);
            console.log(sql);
        }
    }

    async getTermOccurenceLocation(termOccurenceId) {
        const sql = `SELECT l.*, lt.LOCATION_TYPE_NAME 
                    FROM TERM_OCCURRENCE_LOCATIONS tol 
                    JOIN LOCATIONS l ON l.ID = tol.LOCATION_ID
                    JOIN LOCATION_TYPES lt ON lt.ID = l.LOCATION_TYPE 
                    WHERE tol.TERM_OCCURRENCE_ID = :term_occurrence_id
                    AND lt.LOCATION_TYPE_NAME = 'row'`;

        try {
            const result = await connection.execute(sql, [termOccurenceId], options);

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error.message);
            console.log(sql);
        }
    }

    async saveTermOccurenceLocation(termOccurenceId, termLocationId) {
        const sql = `INSERT INTO TERM_OCCURRENCE_LOCATIONS (term_occurrence_id, location_id)
                     VALUES (:termOccurenceId, :termLocationId)`;

        try {
            await connection.execute(sql, [termOccurenceId, termLocationId], options);
        } catch (error) {
            console.log(error.message);
            console.log(sql);
        }
    }

    async saveLocationStatistic(termLocationId, statisticType, statValue) {
        const sql = `INSERT INTO LOCATION_STATISTICS (statistic_type, location_id, statistic_value)
                     VALUES (:statistic_type, :location_id, :statistic_value)`;

        try {
            await connection.execute(sql, [statisticType, termLocationId, statValue], options);
        } catch (error) {
            console.log(error.message);
            console.log(sql);
        }
    }

    async getFileList() {
        const sql = `SELECT *
                     FROM FILE_METADATA_VALUES`;

        try {
            const result = await connection.execute(sql, binds, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getGroupsdata() {
        const sql = `SELECT tg.ID, tg.TERM_GROUP_NAME, JSON_ARRAYAGG(ttg.TERM ORDER BY ttg.TERM) AS GROUP_VALUES
                    FROM TERM_GROUPS tg 
                    JOIN TERM_TERM_GROUPS ttg ON ttg.TERM_GROUP_ID = tg.ID
                    GROUP BY tg.ID, tg.TERM_GROUP_NAME`;

        try {
            const result = await connection.execute(sql, binds, options)

            return helper.formatRow(result.rows);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getGroupByRowid(rowid) {
        const sql = `SELECT *
                     FROM TERM_GROUPS
                     WHERE rowid = :id`;

        try {
            const result = await connection.execute(sql, [rowid], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getGroup(groupName) {
        const sql = `SELECT *
                     FROM TERM_GROUPS
                     WHERE term_group_name = :group_name`;

        try {
            const result = await connection.execute(sql, [groupName], options)

            return helper.formatRow(result.rows)[0];
        } catch (error) {
            console.log(error);
        }
    }

    async saveGroup(groupName) {
        const sql = `INSERT INTO TERM_GROUPS (term_group_name)
                     VALUES (:group_name)`;

        try {
            const res = await connection.execute(sql, [groupName], options);
            const group = await this.getGroupByRowid(res.lastRowid);
            return group;
        } catch (error) {
            return await this.getGroup(groupName);
        }
    }

    async updateGroupsdata(groupData) {
        const group = await this.saveGroup(groupData.term_group_name);

        const sql = `INSERT INTO TERM_TERM_GROUPS (term_group_id, term)
                     VALUES (:term_group_id, :term)`;

        try {
            const groupBinds = groupData.group_values.map((gValue) => {
                return [group.id, gValue];
            });

            await connection.executeMany(sql, groupBinds, options)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {dao}