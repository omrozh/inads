using UnityEngine;
using System.Collections;
using UnityEngine.Networking;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System;

public class InAds : MonoBehaviour {

    public string adType;
    public string apiKey;
    string url;

    void Start() {
        StartCoroutine(GetTexture());
    }
 
    IEnumerator GetTexture() {
        url = "http://inads.herokuapp.com/view/" + adType + "/" + apiKey;
        UnityWebRequest request = UnityWebRequestTexture.GetTexture(url);
        yield return request.SendWebRequest();
        if(request.isNetworkError || request.isHttpError) 
            Debug.Log(request.error);
        else
            Debug.Log(request.url);
            url = request.url;
            gameObject.GetComponent<RawImage>().texture = ((DownloadHandlerTexture) request.downloadHandler).texture;
            gameObject.AddComponent<Button>();
            gameObject.GetComponent<Button>().onClick.AddListener(OnClickAd);
    }
    void OnClickAd(){
        string[] urlsplit = url.Split('/');
        Application.OpenURL("https://inads.herokuapp.com/adclickmobile/" + urlsplit[urlsplit.Length - 1] + "/" + apiKey);
    }
}