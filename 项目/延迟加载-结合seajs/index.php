<?php
	
	 //连接到本地mysql数据库
    $myconn=mysql_connect("localhost","root","");
    //选择test为操作库
    mysql_query("set names 'gbk'"); 

    mysql_select_db("loadint",$myconn);

	$count = $_POST['count'];
    $strSql="select * from loadimg limit ".($count*6).", 6";
    $result=mysql_query($strSql,$myconn);
    while($row=mysql_fetch_assoc($result))
    {
		$rows[] = $row;
	}
	
	sleep(1);
	echo json_encode($rows);
	
	
	/*******
	
	(count+page)*6 + count*6
	
	count  page  value
	
	1		1		
	
	2		2		
	******/
	
?>