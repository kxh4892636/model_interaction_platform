import sys
from osgeo import gdal, osr, ogr


def resolveTXT(src: str) -> list[tuple[str, float, float, float]]:
    dataList: list[tuple[str, float, float, float]] = []
    with open(src, 'r', encoding='utf8') as f:
        f.readline()
        f.readline()
        for line in f:
            content = line.split()
            dataList.append((str(content[0]), float(content[1]),
                             float(content[2]), float(content[3])))

    return dataList


def uvet2png(srcPath, dstPath: str, maskPath: str) -> tuple:
    dataList = resolveTXT(srcPath)

    # create shp file from the csv file
    driver: ogr.Driver = ogr.GetDriverByName('ESRI Shapefile')
    ds: ogr.DataSource = driver.CreateDataSource('/vsimem/temp.shp')
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    srs.ImportFromEPSG(2437)
    # TODO srs file should be supplied
    srs.SetTM(clat=0, clong=120, scale=1, fe=500000, fn=0)
    dst: osr.SpatialReference = osr.SpatialReference()
    dst.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    dst.ImportFromEPSG(4326)
    ct: osr.CoordinateTransformation = osr.CoordinateTransformation(srs, dst)
    layer: ogr.Layer = ds.CreateLayer(
        'mesh', dst, ogr.wkbPoint, options=["ENCODING=UTF-8"])
    # create fields of shp
    layer.CreateField(ogr.FieldDefn('ID', ogr.OFTString))
    layer.CreateField(ogr.FieldDefn('X', ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn('Y', ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn('Z', ogr.OFTReal))
    # create features
    featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
    for data in dataList:
        id = str(data[0])
        x = float(data[1])
        y = float(data[2])
        z = float(data[3])
        coords = ct.TransformPoint(x, y)
        # create feature
        feature: ogr.Feature = ogr.Feature(featureDefn)
        feature.SetField("ID", id)
        feature.SetField("X", coords[0])
        feature.SetField("Y", coords[1])
        feature.SetField("Z", z)
        # create geometry
        point = ogr.Geometry(ogr.wkbPoint)
        point.AddPoint(coords[0], coords[1])
        # set geometry
        feature.SetGeometry(point)
        layer.CreateFeature(feature)
        del feature
    # get the meta of shp
    extent: tuple = layer.GetExtent()
    ratio = abs(((extent[3]-extent[2])/(extent[1]-extent[0])))
    del driver, ds

    # shp2tif
    gridOptions = gdal.GridOptions(format="GTiff", outputType=gdal.GDT_Float32,
                                   algorithm="invdist:power=2.0:smoothing=0.0:radius1=0.0:radius2=0.0:angle=0.0:max_points=100:min_points=30:nodata=-9999", zfield="Z",
                                   width=1000, height=ratio*1000,
                                   )
    gdal.Grid('/vsimem/temp_grid.tif', '/vsimem/temp.shp', options=gridOptions)
    ds: gdal.Dataset = gdal.Open('/vsimem/temp_grid.tif')
    band: gdal.Band = ds.GetRasterBand(1)
    minmax = band.ComputeRasterMinMax(0)
    # fix the error of spatial of gdal.Grid()
    warpOptions = gdal.WarpOptions(
        srcSRS=dst, dstSRS=dst, format='GTiff', cutlineDSName=maskPath, cropToCutline=True)
    gdal.Warp('/vsimem/temp_warp.tif',
              '/vsimem/temp_grid.tif', options=warpOptions)

    # normalize tif
    translateOptions = gdal.TranslateOptions(format='GTiff',
                                             outputType=gdal.GDT_Byte,
                                             scaleParams=[
                                                 [minmax[0], minmax[1], 1, 255]],
                                             )
    gdal.Translate('/vsimem/temp_normalize.tif',
                   '/vsimem/temp_warp.tif',
                   options=translateOptions
                   )
    del band, ds

    # false color composite image
    ds: gdal.Dataset = gdal.Open('/vsimem/temp_normalize.tif')
    band: gdal.Band = ds.GetRasterBand(1)
    [min, max, mean, std] = band.ComputeStatistics(0)
    # create color table
    colors = gdal.ColorTable()
    colors.CreateColorRamp(int(min), (122, 4, 3),
                           int(mean-1.5*std), (227, 68, 10))
    colors.CreateColorRamp(int(mean-1.5*std), (227, 68, 10),
                           int(mean-std), (251, 185, 56))
    colors.CreateColorRamp(int(mean-std), (251, 185, 56),
                           int(mean), (164, 252, 60))
    colors.CreateColorRamp(int(mean), (164, 252, 60),
                           int(mean+std), (27, 229, 181))
    colors.CreateColorRamp(int(mean+std), (27, 229, 181),
                           int(mean+1.5*std), (70, 134, 251))
    colors.CreateColorRamp(int(mean+1.5*std), (70, 134, 251),
                           int(max), (48, 18, 59))
    # set color table and color interpretation
    band.SetRasterColorTable(colors)
    # band.SetRasterColorInterpretation(gdal.GCI_PaletteIndex)
    del band, ds

    # tiff2png
    translateOptions = gdal.TranslateOptions(format='PNG',
                                             )
    gdal.Translate(dstPath,
                   '/vsimem/temp_normalize.tif',
                   options=translateOptions
                   )

    return extent


if __name__ == '__main__':
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    try:
        # sys.argv
        # [src, dst, mask] = sys.argv[1:4]
        src = r"d:\project\001_model_interaction_platform\data\test\uvet2png\uvet_0.txt"
        dst = r"d:\project\001_model_interaction_platform\data\test\uvet2png\uvet_0.png"
        mask = r"d:\project\001_model_interaction_platform\data\test\uvet2png\mesh31.shp"
        uvet2png(src, dst, mask)
    except:
        print('输入参数错误, 请输入文件 url')
    # TODO
