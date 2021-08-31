import json
import requests
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from pyniryo import *

RunScriptValue = False
Place='0'
StringRunConv=False
OpenGripper=True
# Create your views here.
@csrf_exempt
def getTorF(request):
    global RunScriptValue
    try:
        StringReq = request.body.decode("utf-8")
        print('String'+StringReq)
        if(StringReq=='True'):
            print('dakhal galo true')
            RunScriptValue=True
            return HttpResponse(RunScriptValue, content_type='text/json')
        else:
            print('dakhal galo false')
            RunScriptValue=False
            return HttpResponse(RunScriptValue, content_type='text/json')
    except:
        # RunScriptValue=False
        return HttpResponse('Errr', content_type='text/json')



@csrf_exempt
def runConv(request):
    global StringRunConv
    try:
        StringRunConv=not StringRunConv
        if (StringRunConv):
            print('dakhal galo true')
            robot_ip_address = "192.168.1.146"
            robot = NiryoRobot(robot_ip_address)
            robot.update_tool()
            conveyor_id = robot.set_conveyor()
            robot.run_conveyor(conveyor_id, speed=80, direction=ConveyorDirection.FORWARD)
            return HttpResponse('will run ', content_type='text/json')
        else:
            print('dakhal galo false')
            robot_ip_address = "10.10.10.10"
            robot = NiryoRobot(robot_ip_address)
            robot.update_tool()
            conveyor_id = robot.set_conveyor()
            robot.stop_conveyor(conveyor_id)
            return HttpResponse('wont run', content_type='text/json')
    except:
        return HttpResponse('Errr', content_type='text/json')


@csrf_exempt
def openGripper(request):
    global OpenGripper
    try:
        OpenGripper=not OpenGripper
        if (OpenGripper):
            print('dakhal galo true')
            robot_ip_address = "10.10.10.10"
            robot = NiryoRobot(robot_ip_address)
            robot.update_tool()
            robot.close_gripper(speed=500)
            return HttpResponse('close ', content_type='text/json')
        else:
            print('dakhal galo false')
            robot_ip_address = "10.10.10.10"
            robot = NiryoRobot(robot_ip_address)
            robot.update_tool()
            robot.open_gripper(speed=500)
            return HttpResponse('open', content_type='text/json')
    except:
        return HttpResponse('Errr', content_type='text/json')

@csrf_exempt
def getPosition(request):
    global Place
    try:
        # print(Place)
        return HttpResponse(Place, content_type='text/json')
    except:
        return HttpResponse('Errr', content_type='text/json')



def connectRobot(request):
    # r=requests.get('https://reqres.in/api/users?page=2')
    # response = r
    # req=r.json()
    try:
        ned = NiryoRobot("10.10.10.10")
        ned.calibrate_auto()
        ned.move_joints(0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
        response = "Connected"
    except:
        response = "Could not connect to Robot , Please Check connection"
        # print(req['data'][0]['id'])
    return HttpResponse(response, content_type='text/json')

def DisconnectRobot(request):
    try:
        ned = NiryoRobot("10.10.10.10")
        ned.go_to_sleep()
        ned.close_connection()
        response = "DisConnected"
    except:
        response = "Robot not connected"
        # print(req['data'][0]['id'])
    return HttpResponse(response, content_type='text/json')

@csrf_exempt
def RunScript(request):
    global Place
    global RunScriptValue
    # print('RunScript galo '+str(RunScriptValue))
    if RunScriptValue:
        try:
            response=RunScriptValue
            workspace_name = "sim2"  # Robot's Workspace Name
            robot_ip_address = "10.10.10.10"
            robot = NiryoRobot(robot_ip_address)
            # Calibrate robot if the robot needs calibration
            robot.calibrate_auto()
            # Updating tool
            robot.update_tool()
            shape_expected = ObjectShape.CIRCLE
            color_expected = ObjectColor.RED
            conveyor_id = robot.set_conveyor()
            while (RunScriptValue):

                Place = '0'
                mtx, dist = robot.get_camera_intrinsics()
                img_compressed = robot.get_img_compressed()

                img_raw = uncompress_image(img_compressed)

                imgU = undistort_image(img_raw, mtx, dist)

                #     # - Display
                #     # Concatenating raw image and undistorted image
                concat_ims = concat_imgs((img_raw, imgU))
                print('sdsd')
                #     # Showing images
                # key = show_img("Images raw & undistorted", concat_ims, wait_ms=30)
                # if key in [27, ord("q")]:  # Will break loop if the user press Escape or Q
                #     break
                robot.move_joints(0.062, 0.157, -0.028, -0.014, -1.74, -0.025)

                robot.wait(0.5)
                robot.run_conveyor(conveyor_id, speed=80, direction=ConveyorDirection.FORWARD)

                obj_found, pos_array, shape, color = robot.detect_object(workspace_name, shape=shape_expected,
                                                                         color=color_expected)
                if not obj_found:
                    robot.wait(0.5)  # Wait to let the conveyor turn a bit
                    continue
                robot.stop_conveyor(conveyor_id)
                Place='2'
                obj_found, shape, color = robot.vision_pick(workspace_name, shape=shape_expected, color=color_expected)
                robot.close_gripper(500)

                if obj_found:
                    Place = '1'
                    robot.move_joints(-1.52, -1.084, 1.08, -0.066, -0.723, 0.106)
                    robot.open_gripper(500)

                # key = show_img("Images raw & undistorted", concat_ims, wait_ms=30)
                response = robot.get_joints()
                if(not RunScriptValue):
                    break

            robot.stop_conveyor(conveyor_id)
            robot.unset_conveyor(conveyor_id)

            robot.go_to_sleep()
            robot.move_joints(0,0,0,0,0,0)
            response = robot.get_joints()
        except:
            response = "Error"
            # print(req['data'][0]['id'])
    response=RunScriptValue
    return HttpResponse(response, content_type='text/json')

@csrf_exempt
def Movej1(request):
    StringReq=request.body.decode("utf-8")
    r = substring_after(StringReq, "=")
    r=float(r)
    print(r)
    try:
        ned = NiryoRobot("10.10.10.10")
        j1, j2, j3, j4, j5, j6 = ned.get_joints()
        ned.move_joints(r, j2, j3, j4, j5, j6)
        response = "Moved"
        print(type(StringReq))
        return HttpResponse(response, content_type='text/json')
    except:
        response = "Could not connect to Robot , Please Check connection"
         # print(req['data'][0]['id'])
    return HttpResponse(request, content_type='text/json')
@csrf_exempt
def Movej2(request):
    StringReq=request.body.decode("utf-8")
    r = substring_after(StringReq, "=")
    r=float(r)
    print(r)
    try:
        ned = NiryoRobot("10.10.10.10")
        mtx, dist = ned.get_camera_intrinsics()
        j1, j2, j3, j4, j5, j6 = ned.get_joints()
        ned.move_joints(j1, r, j3, j4, j5, j6)
        response = "Moved"
        print(type(r))
        return HttpResponse(response, content_type='text/json')
    except:
        response = "Could not connect to Robot , Please Check connection"
         # print(req['data'][0]['id'])
    return HttpResponse(request, content_type='text/json')



# def connectRobotPost(request):
#     # payload = {'j1': 1, 'j2': 2, 'j3': 3, 'j4': 4, 'j5': 1, 'j6': 1}
#     # r = requests.post("https://reqres.in/api/register", data=payload)
#     # print(r)
#     # response = r
#
#     return HttpResponse(response, content_type='text/json')
def substring_after(s, delim):
    return s.partition(delim)[2]

@csrf_exempt
def main_page(request):
    json_body = json.loads(request.body.decode('utf-8'))
    # r=substring_after(json_body,"=")
    # print(r)
    x = 20
    strs = "j1=" + str(x)
    print(strs)
    return HttpResponse(strs)

@csrf_exempt
def Movej1j2(request):
    StringReq=request.body.decode("utf-8")
    partitioned_stringJ1 = StringReq.partition(';')
    j1 = float(substring_after(partitioned_stringJ1[0], "="))
    partitioned_stringJ2=partitioned_stringJ1[2].partition(';')
    j2 = float(substring_after(partitioned_stringJ2[0], "="))
    partitioned_stringJ3 = partitioned_stringJ2[2].partition(';')
    j3 = float(substring_after(partitioned_stringJ3[0], "="))
    partitioned_stringJ4 = partitioned_stringJ3[2].partition(';')
    j4 = float(substring_after(partitioned_stringJ4[0], "="))
    partitioned_stringJ5 = partitioned_stringJ4[2].partition(';')
    j5 = float(substring_after(partitioned_stringJ5[0], "="))
    partitioned_stringJ6 = partitioned_stringJ5[2].partition(';')
    j6 = float(substring_after(partitioned_stringJ6[0], "="))
    print("j1=",(j1),type(j1))
    print("j2=",j2)
    print("j3=",j3)
    print("j4=",j4)
    print("j5=",j5)
    print("j6=",j6)
    # print(partitioned_stringJ1)
    try:
        ned = NiryoRobot("10.10.10.10")
        # j1, j2, j3, j4, j5, j6 = ned.get_joints()
        ned.move_joints(j1, j2, j3, j4, j5, j6)
        response = "Moved"
        # print(type(StringReq))
        return HttpResponse(request, content_type='text/json')
    except:
        response = "Could not connect to Robot , Please Check connection"
         # print(req['data'][0]['ieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed'])
        return HttpResponse(response, content_type='text/json')