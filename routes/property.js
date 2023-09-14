/* eslint-disable complexity */
const fs = require('fs');

const { Op } = require('sequelize');
const router = require('express').Router();

const { toServerPath } = require('../helpers/uploads');
const { Property, Image } = require('../models');
const { imageUploader } = require('../config/multer');
const { ADMIN_PASSWORD } = require('../config/constants');

/**
 * @typedef {object} PropertyCreationData
 * @property {string} title.required
 * @property {string} action.required
 * @property {number} price.required
 * @property {string} description.required
 * @property {string} titleRus
 * @property {string} ppid
 * @property {string} descriptionRus
 * @property {string} titleTurkey
 * @property {string} descriptionTurkey
 * @property {number} bedrooms
 * @property {number} squareFeet
 * @property {number} buildingAge
 * @property {number} bathrooms
 * @property {number} plotArea
 * @property {boolean} swimmingPool
 * @property {boolean} furniture
 * @property {string} buildingType.required
 * @property {string} region.required
 * @property {number} floorCount
 * @property {string} distanceToLarnaca
 * @property {string} distanceToErcan
 * @property {string} market
 * @property {string} hospital
 * @property {string} features
 */

/**
 * POST /api/property
 * @summary Create Property
 * @tags Properties
 * @param {PropertyCreationData} request.body.required - Property creation data
 * @return {Property} 200 - Created Property
 */

router.post('/', imageUploader.array('file', 25), async (req, res) => {
  try {
    const {
      title,
      titleRus,
      ppid,
      titleTurkey,
      description,
      descriptionRus,
      descriptionTurkey,
      bedrooms,
      squareFeet,
      buildingAge,
      bathrooms,
      plotArea,
      swimmingPool,
      furniture,
      buildingType,
      region,
      floorCount,
      distanceToLarnaca,
      distanceToErcan,
      market,
      hospital,
      action,
      price,
      features,
    } = req.body;

    const password = req.get('password');

    if (password !== ADMIN_PASSWORD) {
      res.status(403).json({ message: 'Wrong password' });
    }

    const property = await Property.create({
      title,
      titleRus,
      ppid,
      titleTurkey,
      description,
      descriptionRus,
      descriptionTurkey,
      bedrooms,
      squareFeet,
      buildingAge,
      bathrooms,
      plotArea,
      swimmingPool,
      furniture,
      buildingType,
      region,
      floorCount,
      distanceToLarnaca,
      distanceToErcan,
      market,
      hospital,
      action,
      price,
      features,
    });

    const seqRunner = function ([first, ...tail]) {
      if (first === undefined) return Promise.resolve();
      try {
        return tail.reduce((p, deed) => p.then(deed), first());
      } catch (e) {
        return Promise.reject(e);
      }
    };

    if (req.files && req.files.length) {
      const promises = req.files.map(async (file) => {
        const { filename } = file;
        return new Promise(() =>
          Image.create({
            path: `/uploads/images/${filename}`,
            propertyId: property.id,
          })
        );
      });

      // await Promise.all(promises);
      // promises.reduce((p, f) => p.then(f), Promise.resolve());
      seqRunner([Promise.resolve(), promises]);
    }

    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * GET /api/property
 * @summary Get property list
 * @tags Properties
 * @security JWT
 * @return {Array.<Property>} 200 - Property list
 */

router.get('/', async (req, res) => {
  try {
    const {
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      type,
      region,
      ppid,
      minPrice,
      maxPrice,
      floorCount,
      hasPool,
      recent,
      action,
      searchTerm,
    } = req.query;

    const where = {};

    if (bedrooms) {
      where.bedrooms = bedrooms;
    }

    if (bathrooms) {
      where.bathrooms = bathrooms;
    }

    if (region) {
      where.region = region;
    }

    if (minArea && !maxArea) {
      where.squareFeet = { [Op.gte]: minArea };
    } else if (!minArea && maxArea) {
      where.squareFeet = { [Op.lte]: maxArea };
    } else if (minArea && maxArea) {
      where.squareFeet = {
        [Op.and]: [{ [Op.gte]: minArea }, { [Op.lte]: maxArea }],
      };
    }

    if (floorCount) {
      where.floorCount = floorCount;
    }

    if (ppid) {
      where.ppid = ppid;
    }

    if (type) {
      where.buildingType = type;
    }

    if (action) {
      where.action = action;
    }

    if (hasPool !== '' && hasPool !== undefined) {
      where.swimmingPool = hasPool;
    }

    if (searchTerm) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { titleRus: { [Op.iLike]: `%${searchTerm}%` } },
        { titleTurkey: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    if (minPrice && !maxPrice) {
      where.price = { [Op.gte]: minPrice };
    } else if (!minPrice && maxPrice) {
      where.price = { [Op.lte]: maxPrice };
    } else if (minPrice && maxPrice) {
      where.price = {
        [Op.and]: [{ [Op.gte]: minPrice }, { [Op.lte]: maxPrice }],
      };
    }

    let order = [];

    if (recent === 'true') {
      order = [['createdAt', 'DESC']];
    }

    const property = await Property.findAndCountAll({
      where,
      include: [{ model: Image }],
      distinct: true,
      order,
    });
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * GET /api/property/{id}
 * @summary Get a single property
 * @tags Properties
 * @param {integer} id.path.required - property id
 * @return {Property} 200 - Property
 */

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [{ model: Image }],
    });
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * DELETE /api/property/{id}
 * @summary Delete a single property
 * @tags Properties
 * @param {integer} id.path.required - property id
 * @security JWT
 * @returns {integer} 200 - Deleted count
 */

router.delete('/:id', async (req, res) => {
  try {
    const password = req.get('password');

    if (password !== ADMIN_PASSWORD) {
      res.status(403).json({ message: 'Wrong password' });
    }

    const property = await Property.findByPk(req.params.id, {
      include: [{ model: Image }],
    });

    const imagesToDelete = property.Images.map((image) => image.path);
    const imageIds = property.Images.map((image) => image.id);
    imagesToDelete.forEach((image) => fs.unlink(toServerPath(image), () => { }));

    await Image.destroy({
      where: {
        id: imageIds,
      },
    });

    await property.destroy();

    res.json(1);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
