import sys
from osgeo import osr


def Mesh2CSV(srcPath: str, dstPath) -> None:
    data: list[str] = []
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    srs.ImportFromEPSG(2437)
    # TODO srs file should be supplied
    srs.SetTM(clat=0, clong=120, scale=1, fe=500000, fn=0)
    dst: osr.SpatialReference = osr.SpatialReference()
    dst.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    dst.ImportFromEPSG(4326)
    ct: osr.CoordinateTransformation = osr.CoordinateTransformation(srs, dst)
    with open(srcPath, 'r', encoding='utf8')as f:
        for line in f:
            # NOTE split() 用法
            content = line.split()
            splitNum = len(content)
            if splitNum == 2:
                data.append(','.join(content)+'\n')
            elif splitNum == 4:
                id = content[0]
                x = float(content[1])
                y = float(content[2])
                z = float(content[3])
                coords = ct.TransformPoint(x, y)
                data.append(f"{id},{coords[0]},{coords[1]},{z}\n")
            elif splitNum == 5:
                tinID = int(content[0])
                point1 = int(content[2])
                point2 = int(content[3])
                point3 = int(content[4])
                [x1, y1] = data[point1].split(',')[1:3]
                [x2, y2] = data[point2].split(',')[1:3]
                [x3, y3] = data[point3].split(',')[1:3]
                tinX = (float(x1) + float(x2) + float(x3))/3
                tinY = (float(y1) + float(y2) + float(y3))/3
                data.append(f"{tinID},{tinX},{tinY}\n")
            elif splitNum == 1:
                break
            elif splitNum == 1:
                break

    with open(dstPath, 'w', encoding='utf8') as f:
        f.writelines(data)


if __name__ == '__main__':
    try:
        # sys.argv
        [src, dst] = sys.argv[1:3]
        # src = r"d:\project\001_model_interaction_platform\data\test\mesh2csv\mesh31.gr3"
        # dst = r"d:\project\001_model_interaction_platform\data\test\mesh2csv\mesh31.csv"
        dataList = Mesh2CSV(src, dst)
        print('success')
    except:
        print('failed')